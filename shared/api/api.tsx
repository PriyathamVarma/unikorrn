// This file contains APIs that are common for the entire app

export const baseAPI =
  "https://governance-elite-86436.bubbleapps.io/version-test/api/1.1/obj";

/*

User Data by ID:
 https://governance-elite-86436.bubbleapps.io/version-test/api/1.1/obj/User/1718720425857x695453764511528200

Meeting Data by User ID:
 https://governance-elite-86436.bubbleapps.io/version-test/api/1.1/obj/Meeting?constraints=[{"key":"Created By","constraint_type":"equals","value":"1718720425857x695453764511528200"}]

Heading Data by ID:
 https://governance-elite-86436.bubbleapps.io/version-test/api/1.1/obj/Heading/1719849085869x457770851012182000

Agenda Item by ID: 
 https://governance-elite-86436.bubbleapps.io/version-test/api/1.1/obj/Agenda_item/1719849887672x985438484774780900


 Expected output;
 {
  "message": "Successful in getting data",
  "AiMessage": {
    "MeetingHeadingAndAgenda": {
      "Heading 1": {
        "Agenda Item 1": "Welcome",
        "Agenda Item 2": "Update from last meeting"
      },
      "Heading 2": {
        "Agenda Item 1": "Cover Page",
        "Agenda Item 2": "Agreeing on future steps"
      },
      "Heading 3": {
        "Agenda Item 1": "Review action points",
        "Agenda Item 2": "Discuss upcoming events"
      }
    }
  }
}
*/
