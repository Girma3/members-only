import startRealTimeUpdate from "./updateMsgTime.js";
const createMsgModal = document.querySelector("[data-name='create-msg-modal']");
const msgForm = document.querySelector("[data-name='create-msg-form']");
const msgBtn = document.querySelector("[data-name='create-msg-btn']");

msgBtn.addEventListener("click", (e) => {
  createMsgModal.show();
});

const msgHolder = document.querySelector("[data-name='msg-holder']");
if (msgHolder) {
  msgHolder.addEventListener("click", async function (e) {
    if (e.target.matches("[data-name='del-msg-btn']")) {
      const msgId = e.target.dataset.id;
      try {
        const endPoint = `/delete/message/${msgId}`;
        const response = await fetch(endPoint, { method: "delete" });
        const result = await response.json();
        if (response.status === 200) {
          window.location.href = result.redirect;
        }
      } catch (err) {
        console.log(err, "err while deleting msg.");
      }
    }
  });
}

if (msgForm) {
  msgForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const endPoint = "/create/message";
    const formData = new FormData(msgForm);
    const formJson = JSON.stringify(Object.fromEntries(formData.entries()));

    try {
      const response = await fetch(endPoint, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: formJson,
      });
      const result = await response.json();

      if (response.status === 200) {
        window.location.href = result.redirect;
      } else if (response.status === 401) {
        //show errors
        console.log(result);
      }
    } catch (err) {
      console.log(err, "err while creating msg.");
    }
  });
}
// start update msg time stamp on page load
document.addEventListener("DOMContentLoaded", startRealTimeUpdate);
