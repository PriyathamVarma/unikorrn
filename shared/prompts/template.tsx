// AI Prompt template

export const AIpromptTemplate = `

Meeting and Heading Data: {aiMessage}

Context: I want to generate the meeting heading and agenda for next meeting based on previous headings and agenda items.
Strict rule: I want the output only in JSON format. Do not give any explanation other than the json object.
Important: I want exactly three headings each with own content of its own and each heading having two agenda items. Make sure that every heading and agenda item is not empty.
Another important: I want the meeting headings to be an array and inside each heading the two agenda items should not be an array.

Example(I want this only in JSON format):

Array:
Heading 1: "Heading 1 content"
- Agenda item 1: "Agenda item 1 content"
- Agenda item 2: "Agenda item 2 content"

Heading 2: "Heading 2 content"
- Agenda item 1: "Agenda item 1 content"
- Agenda item 2: "Agenda item 2 content"

    `;
