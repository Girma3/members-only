import { body, validationResult } from "express-validator";
const validateUser = [
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("name can't be empty!")
    .isLength({ min: 3 })
    .withMessage("name should be at least 3 and more characters"),
  body("userPassword")
    .trim()
    .notEmpty()
    .withMessage("password can't be empty")
    .isLength({ min: 3 })
    .withMessage("password must be 3 or more characters"),
];
const validateMsg = [
  body("userMessage").trim().notEmpty().withMessage("message can't be empty"),
];
async function handleHomePage(req, res) {
  const messages = [{ author: "king", text: "Good Day", timeStamp: "20min" }];

  try {
    res.render("home", { messages: messages });
  } catch (err) {
    console.log(err, "err,while rendering home page");
  }
}
async function handleSignIn(req, res) {
  const errors = validationResult(req);

  try {
    if (errors.array().length) {
      return res.status(400).json({ errors: errors });
    }
    //add user to db
    return res.status(200).json({ redirect: "/" });
  } catch (err) {
    console.log(err, "err,while sign in");
  }
}
async function handleCreateMsg(req, res) {
  const errors = validationResult(req);
  console.log(errors);

  try {
    if (errors.array().length) {
      return res.status(400).json({ errors: errors });
    }
    //add msg to db
    return res.status(200).json({ redirect: "/" });
  } catch (err) {
    console.log(err, "err,while creating message");
  }
}
export {
  handleHomePage,
  validateUser,
  handleSignIn,
  handleCreateMsg,
  validateMsg,
};
