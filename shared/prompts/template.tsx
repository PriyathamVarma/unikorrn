// AI Prompt template
export const AIpromptTemplate = `

Meeting and Heading Data: {aiMessage}

Context: I want to generate the meeting heading and agenda for the next meeting based on previous headings and agenda items.
Strict rule: I want the output only in JSON format. Do not give any explanation other than the json object.
Important: I want exactly two headings each with its own content and each heading having two agenda items. Make sure that every heading and agenda item is not empty.
Another important: I want the meeting headings to be an array and inside each heading, the two agenda items should not be an array.

Example (I want this only in JSON format):

{expected_output}


`;
