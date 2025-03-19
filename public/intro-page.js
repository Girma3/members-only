import startRealTimeUpdate from "./updateMsgTime.js";

const signInFormHolder = document.querySelector("[data-name='form-holder']");
const signInModal = document.querySelector("[data-name='sign-in-modal']");
const signInBtn = document.querySelector("[data-name='sign-in-btn']");
const signInForm = document.querySelector("[data-name='sign-in-form']");

//toggle sign in password
const password = document.querySelector("#userPassword");
const confirmPassword = document.querySelector("#confirmPassword");
const togglePassword = document.querySelector("[data-name='toggle-password']");
//log in form
const logInModal = document.querySelector("[data-name='log-in-modal']");
const logInForm = document.querySelector("[data-name='log-in-form']");
const logInBtn = document.querySelector("[data-name='log-in-btn']");
const logInShowPassword = document.querySelector(
  "[data-name='log-in-checkbox']"
);
const logInPassword = document.querySelector("[data-name='log-in-password']");

function togglePasswordVisibility(passwordInput) {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}

logInBtn.addEventListener("click", (e) => {
  logInModal.showModal();
});

signInBtn.addEventListener("click", (e) => {
  signInModal.showModal();
});
signInModal.addEventListener("click", (e) => {
  if (e.target.matches("[data-name='close-btn']")) {
    signInModal.close();
  }
});
logInModal.addEventListener("click", (e) => {
  if (e.target.matches("[data-name='close-btn']")) {
    logInModal.close();
  }
});

togglePassword.addEventListener("click", () => {
  togglePasswordVisibility(password);
  togglePasswordVisibility(confirmPassword);
});
logInShowPassword.addEventListener("click", () => {
  togglePasswordVisibility(logInPassword);
});

if (signInForm) {
  signInForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (password.value !== confirmPassword.value) {
      confirmPassword.style.color = "red";
    }

    const endPoint = "/sign";
    const formData = new FormData(signInForm);
    const formJson = JSON.stringify(Object.fromEntries(formData.entries()));
    try {
      const response = await fetch(endPoint, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: formJson,
      });
      const result = await response.json();
      console.log(result, "hey home");

      if (response.status === 200) {
        joinClubBtn.style.display = "block";
        window.location.href = result.redirect;
      } else if (response.status === 401) {
        console.log(result);
        //show errors
      }
    } catch (err) {
      console.log(err, "err while sign in.");
    }
  });
}

if (logInForm) {
  logInForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const endPoint = "/log-in";
    const formData = new FormData(logInForm);
    const formJson = JSON.stringify(Object.fromEntries(formData.entries()));

    try {
      const response = await fetch(endPoint, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: formJson,
      });
      const result = await response.json();

      if (response.status === 200) {
        // window.location.href = "/";
        //close modal and show join in club button,log out btn and hide sign in and log in btn
        logInModal.close();
        //joinClubBtn.style.display = "block";
        // signInBtn.style.display = "none";
        window.location.href = result.redirect;
      } else if (response.status === 401) {
        //show errors
        if (result.message) {
          //show authentication error if there
        }
        console.log(result);
      }
    } catch (err) {
      console.log(err, "err while trying to log in msg.");
    }
  });
}
// start update msg time stamp on page load
document.addEventListener("DOMContentLoaded", startRealTimeUpdate);
export default togglePasswordVisibility;
