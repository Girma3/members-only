import startRealTimeUpdate from "./updateMsgTime.js";
//import { showFormErrMsg, hideErrMsg, clearErrMsg } from "./intro-page.js";
const createMsgModal = document.querySelector("[data-name='create-msg-modal']");
const msgForm = document.querySelector("[data-name='create-msg-form']");
const msgBtn = document.querySelector(".msg-btn");

// join club form
const joinClubModal = document.querySelector("[data-name='join-club-modal']");
const joinClubForm = document.querySelector("[data-name='join-club-form']");
const joinClubBtn = document.querySelector("[data-name='join-club-btn']");
// err spans join form
const errSpans = joinClubForm.querySelectorAll(".err-msg");
//input
const passcodeInput = joinClubForm.querySelector("input");

const createMsgFormHolder = document.querySelector(
  "[data-name='create-msg-form']"
);
const createMsgBtn = document.querySelector("[data-name='create-msg-btn']");
msgBtn.addEventListener("click", (e) => {
  createMsgModal.show();
});
joinClubBtn.addEventListener("click", (e) => {
  joinClubModal.showModal();
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
        window.location.href = result.redirect;
      } else if (response.status === 400) {
        //show errors
        console.log(result);
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
      console.log(result);

      if (response.status === 200) {
        joinClubForm.reset();
        // createMsgBtn.style.display = "block";
        // window.location.href = result.redirect;
        joinClubModal.close();
        ///reveal the message author and show admin login btn
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
