import startRealTimeUpdate from "./updateMsgTime.js";

const msgForm = document.querySelector("[data-name='create-msg-form']");
const msgInput = msgForm.querySelector("textarea");
const errMsgSpan = msgForm.querySelector(".err-msg");
// join club form
const joinClubModal = document.querySelector("[data-name='join-club-modal']");
const joinClubForm = document.querySelector("[data-name='join-club-form']");
const joinClubBtn = document.querySelector("[data-name='join-club-btn']");
// err spans join form
const errSpans = joinClubForm.querySelectorAll(".err-msg");
//input
const passcodeInput = joinClubForm.querySelector("input");

joinClubBtn.addEventListener("click", (e) => {
  joinClubModal.showModal();
});
joinClubModal.addEventListener("click", (e) => {
  if (e.target.matches("[data-name='close-btn']")) {
    joinClubModal.close();
  }
});

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
        msgForm.reset();
        window.location.href = result.redirect;
      } else if (response.status === 401) {
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
// join club
if (joinClubForm) {
  joinClubForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const endPoint = "/join-club";
    const formData = new FormData(joinClubForm);
    const formJson = JSON.stringify(Object.fromEntries(formData.entries()));

    try {
      const response = await fetch(endPoint, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: formJson,
      });
      const result = await response.json();
      if (response.status === 200) {
        joinClubForm.reset();
        joinClubModal.close();
        //reveal the message author
        window.location.href = result.redirect;
      } else if (response.status === 401) {
        //show errors
        const errArray = result.errors;
        errArray.forEach((err, index) => {
          if (errArray[index].path == errSpans[index].dataset.field) {
            errSpans[index].textContent = err.msg;
          }
        });
        passcodeInput.addEventListener("input", () => {
          errSpans.forEach((span) => (span.textContent = ""));
        });
      }
    } catch (err) {
      console.log(err, "err while join club msg.");
    }
  });
}
// start update msg time stamp on page load
document.addEventListener("DOMContentLoaded", startRealTimeUpdate);
