addEventListener("message", async (message) => {
  const url = "https://opentdb.com/api.php?amount=1&type=boolean";

  if (message.data.command === "generate") {
    try {
      const response = await fetch(url);
      const data = await response.json();

      postMessage(data);
    } catch (err) {
      postMessage(err);
    }
  }
})
