// Import necessary modules and types
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { AIpromptTemplate } from "../../../../../shared/prompts/template";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";

// Define response data types
type ResponseData = {
  message?: string;
  meeting_data?: any; // Update this type according to your actual data structure
  heading_data?: any[]; // Update this type according to your actual data structure
  AiMessage?: any;
  error?: {
    message: string;
    status?: number;
  };
};

// Function to fetch heading details by heading ID
const fetchHeadingDetails = async (headingId: string) => {
  try {
    const response = await axios.get(
      `https://governance-elite-86436.bubbleapps.io/version-test/api/1.1/obj/Heading/${headingId}`,
    );
    return response.data.response;
  } catch (err) {
    console.error(
      `Error fetching heading details for ID ${headingId}: \n`,
      err,
    );
    return null;
  }
};

// Function to fetch agenda item details by agenda item ID
const fetchAgendaItemDetails = async (agendaItemId: string) => {
  try {
    const response = await axios.get(
      `https://governance-elite-86436.bubbleapps.io/version-test/api/1.1/obj/Agenda_item/${agendaItemId}`,
    );
    return response.data.response;
  } catch (err) {
    console.error(
      `Error fetching agenda item details for ID ${agendaItemId}: \n`,
      err,
    );
    return null;
  }
};

// GET endpoint to retrieve data
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const user_id = req.nextUrl.searchParams.get("user_id");
    const meeting_type = req.nextUrl.searchParams.get("meeting_type");

    // Fetch meetings data filtered by user ID
    const constraints = JSON.stringify([
      { key: "Created By", constraint_type: "equals", value: user_id },
    ]);
    const meetingDataResponse = await axios.get(
      `https://governance-elite-86436.bubbleapps.io/version-test/api/1.1/obj/Meeting?constraints=${encodeURIComponent(
        constraints,
      )}`,
    );
    const meetingsWithHeadings =
      meetingDataResponse.data.response.results.filter(
        (meeting: any) => meeting.Headings && meeting.Headings.length > 0,
      );
    const sortedMeetings = meetingsWithHeadings.sort((a: any, b: any) => {
      const dateA = new Date(a["Modified Date"] || a["Time"]).getTime();
      const dateB = new Date(b["Modified Date"] || b["Time"]).getTime();
      return dateB - dateA; // descending order
    });
    // Filter meetings by meeting type
    const filteredMeetings = sortedMeetings.filter(
      (meeting: any) => meeting.Meeting_Type === meeting_type,
    );

    // Get the latest meeting based on the meeting type or fallback to the latest sorted meeting
    const latestMeeting =
      filteredMeetings.length > 0 ? filteredMeetings[0] : sortedMeetings[0];

    // Fetch heading details for each meeting heading
    const headingDetailsPromises = latestMeeting.Headings.map(
      (headingId: string) => fetchHeadingDetails(headingId),
    );
    const headingDetails = await Promise.all(headingDetailsPromises);

    // Fetch agenda item details for each agenda item in each heading
    const agendaItemDetailsPromises = headingDetails
      .map((heading: any) => heading.Agenda_Items)
      .flat()
      .map((agendaItemId: string) => fetchAgendaItemDetails(agendaItemId));
    const agendaItemDetails = await Promise.all(agendaItemDetailsPromises);

    // Format the AI message object
    const aiMessage = {
      meeting_data: latestMeeting,
      heading_data: JSON.stringify(
        headingDetails.map((heading: any, index: number) => ({
          ...heading,
          Agenda_Items: agendaItemDetails[index],
        })),
      ),
    };

    // Create AI prompt template
    const prompt = PromptTemplate.fromTemplate(AIpromptTemplate);

    // Initialize ChatOpenAI model
    const model = new ChatOpenAI({
      openAIApiKey: process.env.NEXT_PUBLIC_OPEN_AI as string,
    });

    // Create a pipeline with prompt and model
    const chain = prompt.pipe(model);

    const expected_output = JSON.stringify(
      '  "message": "Successful in getting data",\n "AiMessage": {"Meeting": {"Headings": [{"Heading": "Update on project status","Agenda item 1": "Review progress on deliverables","Agenda item 2": "Discuss any issues or roadblocks"},{"Heading": "Budget allocation for upcoming quarter","Agenda item 1": "Present financial projections", "Agenda item 2": "Allocate resources accordingly"},{"Heading": "Team building activities","Agenda item 1": "Plan upcoming team retreat","Agenda item 2": "Discuss team bonding exercises"}]}}',
    );

    // Invoke the AI model with the correct parameters
    const result = await chain.invoke({
      aiMessage: aiMessage as any,
      expected_output,
    });

    // Parse AI result content into JSON
    const parsedAiMessage = JSON.parse(result.content as string);

    // Return JSON response
    return NextResponse.json<ResponseData>({
      message: "Successful in getting data",
      AiMessage: parsedAiMessage,
      // AiMessage: latestMeeting,
    });
  } catch (err) {
    console.error("Error fetching data: \n", err);
    return NextResponse.json({
      message: "Error fetching data.",
      error: "An unknown error occurred.",
    });
  }
}
