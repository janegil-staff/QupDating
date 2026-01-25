// sendPushNotification.js
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function sendPushNotification(expoPushToken, title, body, data = {}) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data,
  };

  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const result = await response.json();
  console.log("Expo push result:", result);

  return result;
}

module.exports = { sendPushNotification };
