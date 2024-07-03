// AI Prompt template

export const AIpromptTemplate = `

Meeting and Heading Data: {aiMessage}

Context: I want to generate the meeting heading and agenda for next meeting based on previous headings and agenda items.
Strict rule: I want the output only in JSON format. Do not give any explanation other than the json object.
Important: I want exactly three headings , each having two agenda items. Make sure that every heading and agenda item is not empty.

Example(I want this only in JSON format):

Heading 1:
- Agenda item 1:
- Agenda item 2:

Heading 2:
- Agenda item 1:
- Agenda item 2:

    `;
