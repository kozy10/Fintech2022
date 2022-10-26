// TODO: Set access token got from LINE Developers console
const ACCESS_TOKEN = "";
const COIN_MARKET_PLACE_API_KEY = "";
const lineReplyURL = "https://api.line.me/v2/bot/message/reply";
const coinMarketPlaceURL =
  "https://pro-api.coinmarketcap.com/v1/tools/price-conversion";

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
  if (event.message.text == "BTC" || event.message.text == "btc") {
    const response = UrlFetchApp.fetch(
      coinMarketPlaceURL + "?amount=1&id=1&convert=JPY",
      {
        headers: {
          "X-CMC_PRO_API_KEY": COIN_MARKET_PLACE_API_KEY,
        },
        method: "get",
      }
    );
    const jsonData = JSON.parse(response.getContentText());
    const btcPrice = jsonData.data.quote.JPY.price;
    const roundedPrice = parseInt(btcPrice, 10);
    UrlFetchApp.fetch(lineReplyURL, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        Authorization: "Bearer " + ACCESS_TOKEN,
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
            text: roundedPrice + "円",
          },
        ],
      }),
    });
    return;
  }
  // request to line server to post message to talk room
  UrlFetchApp.fetch(lineReplyURL, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + ACCESS_TOKEN,
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
