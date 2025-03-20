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
// sign in input and label
const inputHolders = document.querySelectorAll(".input-holder");
// err msg spans sign in
const errSignInSpans = signInForm.querySelectorAll(".err-msg");
// err msg log in
const logInFormInputs = logInForm.querySelectorAll("input");
const errLogInSpans = logInForm.querySelectorAll(".err-msg");

let errMsgs = [
  {
    type: "field",
    value: "",
    msg: "name can't be empty!",
    path: "userName",
    location: "body",
  },
  {
    type: "field",
    value: "",
    msg: "name should be at least 3 and more characters",
    path: "userName",
    location: "body",
  },
];
let logErr = [
  {
    type: "field",
    value: "",
    msg: "name can't be empty!",
    path: "logInUserName",
    location: "body",
  },
  {
    type: "field",
    value: "",
    msg: "name should be at least 3 and more characters",
    path: "logInUserName",
    location: "body",
  },
  {
    type: "field",
    value: "",
    msg: "password can't be empty",
    path: "logInUserPassword",
    location: "body",
  },
  {
    type: "field",
    value: "",
    msg: "password must be at least 3  characters",
    path: "logInUserPassword",
    location: "body",
  },
];
//hide on input event for  login err msg

//function that accept spans and msg as an array from backend to show error msg
function showFormErrMsg(spanArray, msgArray) {
  if (!spanArray.length || !msgArray.length) return;
  spanArray.forEach((span, index) => {
    if (msgArray[index] && span.dataset.field == msgArray[index].path) {
      span.textContent = msgArray[index].msg;
    }
  });
}
//showFormErrMsg(errSignInSpans, errMsgs);
//function to hide err msg when input on focus (used later)
function hideErrMsg(errSpans, input) {
  errSpans.forEach((span) => {
    if (span.dataset.field == input.name) {
      span.style.display = "none";
    }
  });
}

inputHolders.forEach((holder, index) => {
  const input = holder.querySelector("input");
  const label = holder.querySelector("label");

  input.addEventListener("focus", () => {
    label.style.top = "-12px";
  });
  input.addEventListener("input", () => {
    hideErrMsg(errSignInSpans, input);
  });

  input.addEventListener("blur", () => {
    if (!input.value) {
      label.style.top = "initial";
    }
  });
});
function clearErrMsg(eleArray) {
  eleArray.forEach((span) => {
    span.textContent = "";
  });
}

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

      if (response.status === 200) {
        signInForm.reset();
        clearErrMsg(errSignInSpans);
        signInModal.close();
        window.location.href = result.redirect;
      } else if (response.status === 401) {
        //show form errors  msgs
        showFormErrMsg(errSignInSpans, result.errors.errors);
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
        //reset form
        logInForm.reset();
        clearErrMsg(errLogInSpans);
        logInModal.close();

        window.location.href = result.redirect;
      } else if (response.status === 401) {
        console.log(result.errors);
        //show errors and add event to hide on input
        showFormErrMsg(errLogInSpans, result.errors);
        logInFormInputs.forEach((input) => {
          input.addEventListener("input", () => {
            hideErrMsg(errLogInSpans, input);
          });
        });
      }
    } catch (err) {
      console.log(err, "err while trying to log in msg.");
    }
  });
}

// start update msg time stamp on page load
document.addEventListener("DOMContentLoaded", startRealTimeUpdate);
export { showFormErrMsg, hideErrMsg, clearErrMsg };
