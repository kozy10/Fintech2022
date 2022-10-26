// TODO: Set access token got from LINE Developers console
const ACCESSTOKEN = "";
const URL = "https://api.line.me/v2/bot/message/reply";

// this is a function which call from line server
function doPost(e) {
  var events = JSON.parse(e.postData.contents).events;
  // chack the event type of events one by one
  events.forEach(function (event) {
    if (event.type == "message" && event.message.type == "text") {
      reply(event);
    }
  });
}

function reply(event) {
  // request to line server to post message to talk room
  UrlFetchApp.fetch(URL, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + ACCESSTOKEN,
    },
    method: "post",
    payload: JSON.stringify({
      replyToken: event.replyToken,
      // below is codes for set messages look like.
      // type is text(you can set image etc)
      // text is the message
      messages: [
        {
          type: "text",
          text: event.message.text,
        },
      ],
    }),
  });
}
