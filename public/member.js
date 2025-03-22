import startRealTimeUpdate from "./updateMsgTime.js";

const msgForm = document.querySelector("[data-name='create-msg-form']");
const msgInput = msgForm.querySelector("textarea");
const errMsgSpan = msgForm.querySelector(".err-msg");
//
const adminModal = document.querySelector("[data-name='admin-modal']");
const adminForm = document.querySelector("[data-name='admin-form']");
const adminBtn = document.querySelector("[data-name='admin-btn']");

const passCodeInput = adminForm.querySelector("input");
const errSpans = adminForm.querySelectorAll(".err-msg");

adminBtn.addEventListener("click", () => {
  adminModal.showModal();
});
adminModal.addEventListener("click", (e) => {
  if (e.target.matches("[data-name='close-btn']")) {
    adminModal.close();
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

if (adminForm) {
  adminForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const endPoint = "/admin";
    const formData = new FormData(adminForm);
    const formJson = JSON.stringify(Object.fromEntries(formData.entries()));

    try {
      const response = await fetch(endPoint, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: formJson,
      });
      const result = await response.json();

      if (response.status === 200) {
        adminForm.reset();
        window.location.href = result.redirect;
      } else if (response.status === 401) {
        //show errors
        const errArray = result.errors;
        errArray.forEach((err, index) => {
          if (errArray[index].path == errSpans[index].dataset.field) {
            errSpans[index].textContent = err.msg;
          }
        });
        passCodeInput.addEventListener("input", () => {
          errSpans.forEach((span) => (span.textContent = ""));
        });
       
      }
    } catch (err) {
      console.log(err, "err while trying to be admin.");
    }
  });
}
// start update msg time stamp on page load
document.addEventListener("DOMContentLoaded", startRealTimeUpdate);
