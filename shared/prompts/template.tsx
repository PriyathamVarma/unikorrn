// AI Prompt template

export const AIpromptTemplate = `

{data}

Context: I want to generate the meeting heading and agenda for next meeting based on previous headings and agenda items.
Strict rule: I want the output only in JSON format. Do not give any explanation other than the json object.

Example:
{
heading1: "some heading here",
[
agenda_item:"agenda item1 for heading",
....
],
heading2:"some other heading here",
[
agenda_item:"agenda item1 for second heading,
.......
],
.........
}

    `;
