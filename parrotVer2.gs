const ACCESS_TOKEN =
  PropertiesService.getScriptProperties().getProperty("ACCESS_TOKEN");
const COIN_MARKET_CAP_API_KEY =
  PropertiesService.getScriptProperties().getProperty(
    "COIN_MARKET_CAP_API_KEY"
  );
const lineReplyURL = "https://api.line.me/v2/bot/message/reply";
const coinMarketCapURL =
  "https://pro-api.coinmarketcap.com/v1/tools/price-conversion";

function doPost(e) {
  var events = JSON.parse(e.postData.contents).events;
  events.forEach(function (event) {
    if (event.type == "message" && event.message.type == "text") {
      reply(event);
    }
  });
}

function reply(event) {

  if (event.message.text == "BTC" || event.message.text == "btc") {
    // if the message is "BTC" or "btc", get bitcoin price from CoinMarketCap API
    // もしメッセージがBTCまたはbtcの場合、CoinMarketCap APIにリクエストを送信してビットコインの価格データを取得します。
    const response = UrlFetchApp.fetch(
        coinMarketCapURL + "?amount=1&id=1&convert=JPY",
      {
        headers: {
          "X-CMC_PRO_API_KEY": COIN_MARKET_CAP_API_KEY,
        },
        method: "get",
      }
    );
    const jsonData = JSON.parse(response.getContentText());
    const btcPrice = jsonData.data.quote.JPY.price;
    const roundedPrice = parseInt(btcPrice, 10);
    // request to the LINE server to post the bitcoin price to the chat room
    // ビットコイン価格をメッセージとして投稿するようにLINEサーバーにリクエストを送信します。
    UrlFetchApp.fetch(lineReplyURL, {
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
            text: roundedPrice + "円",
          },
        ],
      }),
    });
    return;
  }
  // request to the LINE server to post same message to the chat room
  // 同じメッセージを投稿するように、LINEサーバーにリクエストを送信します。
  UrlFetchApp.fetch(lineReplyURL, {
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
