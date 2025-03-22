import startRealTimeUpdate from "./updateMsgTime.js";

const msgForm = document.querySelector("[data-name='create-msg-form']");
const msgInput = msgForm.querySelector("textarea");
const errMsgSpan = msgForm.querySelector(".err-msg");

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
        const errMsg = result.errors[0].msg;
        errMsgSpan.textContent = errMsg;
        msgInput.addEventListener("input", () => {
          errMsgSpan.textContent = "";
        });
      }
    } catch (err) {
      console.log(err, "err while creating msg.");
    }
  });
}
//delete msg
const msgHolder = document.querySelector(".msg-ul");
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
// start update msg time stamp on page load
document.addEventListener("DOMContentLoaded", startRealTimeUpdate);
