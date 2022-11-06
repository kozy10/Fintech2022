const ACCESS_TOKEN =
  PropertiesService.getScriptProperties().getProperty("ACCESS_TOKEN");
const URL = "https://api.line.me/v2/bot/message/reply";

// doPost is the function that is called when POST request is sended to GAS server.
// doPost関数はPOSTリクエストがGASサーバーに送信されたときに呼ばれる関数です。
function doPost(e) {
  // Extracts an event from the request data and stores it in a variable
  // 送信されたデータの中からイベントを取り出して、変数に格納します
  var events = JSON.parse(e.postData.contents).events;
  events.forEach(function (event) {
    // Calls the reply function when the event is a message and the message type is text
    // イベントがメッセージかつ、メッセージタイプがテキストの時にreply関数を呼びます
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
      // Include the access token issued by LINE Developers in the request.
      // This allows the LINE server to verify that the request was made by the chatbot operator.
      // LINE Developersで発行したアクセストークンをリクエストに含めます。
      // これによってLINEサーバーはチャットボットの運用者によるリクエストであるかを検証することができます。
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
    method: "post",
    payload: JSON.stringify({
      replyToken: event.replyToken,
      messages: [
        {
          type: "text",
          // event.message.text represents the text sent. Request it to be sent back.
          // event.message.textは送信されたテキストを表します。それを送り返すようにリクエストします。
          text: event.message.text,
        },
      ],
    }),
  });
}
