const ACCESS_TOKEN =
  PropertiesService.getScriptProperties().getProperty("ACCESS_TOKEN");
const URL = "https://api.line.me/v2/bot/message/reply";

function doPost(e) {
  var events = JSON.parse(e.postData.contents).events;
  events.forEach(function (event) {
    if (event.type == "message" && event.message.type == "text") {
      reply(event);
    }
  });
}

function reply(event) {
  // request to the LINE server to post same message to the chat room
  // 同じメッセージを投稿するように、LINEサーバーにリクエストを送信します。
  UrlFetchApp.fetch(URL, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
    method: "post",
    payload: JSON.stringify({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          text: event.message.text,
        },
      ],
    }),
  });
}
