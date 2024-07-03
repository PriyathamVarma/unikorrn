// ->> api/v1/data

import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { baseAPI } from "../../../../../shared/api/api";

// Response Data
type ResponseData = {
  message?: string;
  meeting_data?: any;
  heading_data?: any;
  error?: {
    message: string;
    status?: number;
  };
};

// Fetch heading details by heading ID
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

// Fetch agenda item details by agenda item ID
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

// **GET** - Retrieve data
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const user_id = "1718720425857x695453764511528200";
    console.log(
      "--------------------------------------------------------------",
    );

    // Meeting Data
    const constraints = JSON.stringify([
      { key: "Created By", constraint_type: "equals", value: user_id },
    ]);

    const meeting_data = await axios.get(
      `https://governance-elite-86436.bubbleapps.io/version-test/api/1.1/obj/Meeting?constraints=${encodeURIComponent(
        constraints,
      )}`,
    );

    // Filter meetings that have headings
    const meetingsWithHeadings = meeting_data.data.response.results.filter(
      (meeting: any) => meeting.Headings && meeting.Headings.length > 0,
    );

    // Sorting filtered data by "Modified Date" or "Time"
    const sortedMeetings = meetingsWithHeadings.sort((a: any, b: any) => {
      const dateA = new Date(a["Modified Date"] || a["Time"]).getTime();
      const dateB = new Date(b["Modified Date"] || b["Time"]).getTime();
      return dateB - dateA; // descending order
    });

    // Get the latest meeting with headings
    const latestMeeting = sortedMeetings[0];

    // Fetch detailed data for each heading
    const headingDetailsPromises = latestMeeting.Headings.map(
      (headingId: string) => fetchHeadingDetails(headingId),
    );
    const headingDetails = await Promise.all(headingDetailsPromises);

    // Fetch agenda item details for each agenda item in each heading
    const agendaItemDetailsPromises = headingDetails
      .map((heading: any) => heading.Agenda_Items)
      .flat() // Flatten array of agenda item IDs
      .map((agendaItemId: string) => fetchAgendaItemDetails(agendaItemId));

    const agendaItemDetails = await Promise.all(agendaItemDetailsPromises);

    return NextResponse.json<ResponseData>({
      message: "Successful in getting data",
      meeting_data: latestMeeting,
      heading_data: headingDetails.map((heading: any, index: number) => ({
        ...heading,
        Agenda_Items: agendaItemDetails[index],
      })),
    });
  } catch (err) {
    console.error("Error fetching data: \n", err);
    return NextResponse.json({
      message: "Error fetching data.",
      error: "An unknown error occurred.",
    });
  }
}
