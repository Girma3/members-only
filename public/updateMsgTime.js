// Function to fetch users data from the server
async function fetchMessages() {
  const endPoint = "/api/messages";
  try {
    const response = await fetch(endPoint, { method: "get" });
    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err, "err while fetching msgs");
  }
}
// Function to update the DOM with user data
function updateMsgTimeStamp(msgs) {
  const allMsgTimeStamp = document.querySelectorAll(".msg-time");

  msgs.forEach((msg, index) => {
    if (allMsgTimeStamp[index]) {
      allMsgTimeStamp[index].textContent = msg.timestamp;
    }
  });
}

// Function to start the real-time updates
async function startRealTimeUpdate() {
  try {
    const msgs = await fetchMessages(); // Initial fetch when page loads
    updateMsgTimeStamp(msgs.messages);
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }
  // update every minute  can be changed

  setInterval(async () => {
    try {
      const msgs = await fetchMessages();
      updateMsgTimeStamp(msgs.messages);
    } catch (error) {
      console.error("Failed to fetch users messages:", error);
    }
  }, 60000);
}

export default startRealTimeUpdate;
