import startRealTimeUpdate from "./updateMsgTime.js";

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

//function that accept spans and msg as an array from backend to show error msg
function showFormErrMsg(spanArray, msgArray) {
  console.log(msgArray);
  // create a map for quick lookup of messages
  const msgMap = new Map(msgArray.map((msg) => [msg.path, msg.msg]));

  spanArray.forEach((span) => {
    const field = span.dataset.field;
    // check if there's a corresponding message
    if (msgMap.has(field)) {
      span.textContent = msgMap.get(field); // set the error msg
      span.style.display = "block";
      msgMap.delete(field); // remove the msg to prevent reuse
    } else {
      span.style.display = "none";
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
inputHolders.forEach((holder, index) => {
  const input = holder.querySelector("input");
  const label = holder.querySelector("label");

  input.addEventListener("focus", () => {
    label.style.top = "-12px";
  });
  input.addEventListener("blur", () => {
    if (!input.value) {
      label.style.top = "initial";
    }
  });

  input.addEventListener("input", () => {
    if (password.value !== confirmPassword.value) {
      confirmPassword.style.color = "red";
    } else if (password.value == confirmPassword.value) {
      confirmPassword.style.color = "green";
    }
  });
});
logInBtn.addEventListener("click", (e) => {
  logInModal.showModal();
});

signInBtn.addEventListener("click", (e) => {
  signInModal.showModal();
});
signInModal.addEventListener("click", (e) => {
  if (e.target.matches("[data-name='close-btn']")) {
    signInForm.reset();
    clearErrMsg(errSignInSpans);
    signInModal.close();
  }
});
logInModal.addEventListener("click", (e) => {
  if (e.target.matches("[data-name='close-btn']")) {
    logInForm.reset();
    clearErrMsg(errLogInSpans);
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
        const errors = result.errors.errors;
        showFormErrMsg(errSignInSpans, errors);
        const signInInputs = signInForm.querySelectorAll("input");
        signInInputs.forEach((input) => {
          input.addEventListener("input", () => {
            hideErrMsg(errSignInSpans, input);
          });
        });
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
        //show errors and add event to hide on input
        const errors = result.errors;
        //show err if user not authenticated
        if (!errors && result.message) {
          errLogInSpans[0].textContent = result.message;
          return;
        }
        showFormErrMsg(errLogInSpans, errors);
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
