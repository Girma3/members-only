import { body, validationResult } from "express-validator";
import {
  updateUserStatusById,
  updateUserToAdminById,
  getAllMessages,
  addMessages,
  deleteMessage,
} from "../db/queries.js";
import authenticateUser from "../middleware/authController.js";
import { format, formatDistanceToNow, parseISO } from "date-fns";
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
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("confirm password can't be empty")
    .isLength({ min: 3 })
    .withMessage("confirm password must be 3 or more characters"),
];
const validateMsg = [
  body("userMessage").trim().notEmpty().withMessage("message can't be empty"),
];
const validateLogIn = [
  body("logInUserName")
    .trim()
    .notEmpty()
    .withMessage("name can't be empty!")
    .isLength({ min: 3 })
    .withMessage("name should be at least 3 and more characters"),
  body("logInUserPassword")
    .trim()
    .notEmpty()
    .withMessage("password can't be empty")
    .isLength({ min: 1 }) //adjust later
    .withMessage("password must be at least 3  characters"),
];
const validateJoinClub = [
  body("userJoinClub")
    .trim()
    .notEmpty()
    .withMessage("passcode can't be empty.")
    .isLength({ min: 2 })
    .withMessage("pass code mut beat least 2 characters.") //adjust it
    .custom((value) => {
      if (value !== "xy") {
        throw new error("Invalid passcode read the clue and try again");
      }
      return true;
    }),
];

const validateAdmin = [
  body("adminPasscode")
    .trim()
    .notEmpty()
    .withMessage("passcode can't be empty.")
    .isLength({ min: 2 })
    .withMessage("pass code mut beat least 2 characters.") //adjust it
    .custom((value) => {
      if (value !== "gh") {
        throw new error("Invalid passcode read the clue and try again");
      }
      return true;
    }),
];
async function handleHomePage(req, res) {
  try {
    const messages = await getFormattedMessages();
    res.render("home", {
      messages: messages,
      showAuthor: false,
      isAdmin: false,
    });
  } catch (err) {
    console.log(err, "err,while rendering home page");
  }
}
async function handleIntroPage(req, res) {
  try {
    const messages = await getFormattedMessages();
    res.render("intro-page", {
      messages: messages,
      showAuthor: false,
      isAdmin: false,
    });
  } catch (err) {
    console.log(err, "err,while rendering intro page");
  }
}
async function handleMemberPage(req, res) {
  let msg;
  if (!req.session.views) {
    msg = `Hey, ${req.session.user.name} you are now officially a member of our club!`;
    req.session.views = "1";
  }

  try {
    const messages = await getAllMessages();
    res.render("member-page", {
      messages: messages,
      showAuthor: true,
      isAdmin: false,
      msg: msg,
    });
  } catch (err) {
    console.log(err, "err,while rendering member page");
  }
}
async function handleAdminPage(req, res) {
  try {
    const messages = await getFormattedMessages();

    res.render("admin-page", {
      messages: messages,
      showAuthor: true,
      isAdmin: true,
    });
  } catch (err) {
    console.log(err, "err,while rendering admin page");
  }
}
async function handleDeleteMsg(req, res) {
  const { id } = req.params.id;

  try {
    await deleteMessage(id);
    res.status(200).json({ redirect: "/admin-page" });
  } catch (err) {
    console.log(err, "err,while deleting msg ");
  }
}
async function handleSignIn(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors });
  }
  try {
    //add user to db

    return res.status(200).json({ redirect: "/home" });
  } catch (err) {
    console.log(err, "err,while sign in");
  }
}
async function handleCreateMsg(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { userMessage } = req.body;
  const userId = req.session.user.id;

  try {
    //add msg to db
    await addMessages(userId, userMessage);
    if (req.session.user.admin === true) {
      return res.status(200).json({
        redirect: "/admin-page",
        user: req.user,
      });
    } else if (req.session.user.member === true) {
      return res.status(200).json({
        redirect: "/member",
        user: req.user,
      });
    }

    //redirect using request path
    return res.status(200).json({ redirect: "/" });
  } catch (err) {
    console.log(err, "err,while creating message");
  }
}
async function handleLogIn(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  console.log(req.session.user);

  authenticateUser(req, res, async () => {
    try {
      if (req.session.user.admin === true) {
        return res.status(200).json({
          redirect: "/admin-page",
          user: req.user,
        });
      } else if (req.session.user.member === true) {
        return res.status(200).json({
          redirect: "/member",
          user: req.user,
        });
      }
      return res.status(200).json({
        redirect: "/",
        user: req.user,
      });
    } catch (err) {
      console.error("Error during login:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
}

async function handleJoinClub(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }

  try {
    //show admin btn in frontend and  reveal authors
    await updateUserStatusById(req.user.id);

    return res.status(200).json({ redirect: "/member" });
  } catch (err) {
    console.log(err, "err,while joining club.");
    return res.status(401).json({ showAuthors: "false" });
  }
}
async function handleUserToAdmin(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }

  try {
    await updateUserToAdminById(req.user.id);
    return res.status(200).json({ redirect: "/admin-page" });
  } catch (err) {
    console.log(err, "err,while user to be an admin.");
    return res.status(402).json({ showAuthors: "false" });
  }
}
async function getFormattedMessages() {
  try {
    const messages = await getAllMessages();

    const formattedMsg = formatMessagesTimeStamp(messages);
    return formattedMsg;
  } catch (err) {
    console.log(err, "err while formatting msg timestamp");
  }
}
function formatMessagesTimeStamp(messages) {
  return messages.map((message) => ({
    ...message,
    timestamp: formatDistanceToNow(new Date(message.timestamp), {
      addSuffix: true,
    }), // Format timestamp
  }));
}
async function handleUpdateMsgTimeStamp(req, res) {
  try {
    const messages = await getFormattedMessages();

    return res.status(200).json({ messages: messages });
  } catch (err) {
    console.log(err, "err while updating msg timestamp");
  }
}

export {
  handleHomePage,
  handleIntroPage,
  handleMemberPage,
  handleAdminPage,
  validateUser,
  handleSignIn,
  handleCreateMsg,
  validateMsg,
  handleLogIn,
  validateLogIn,
  validateJoinClub,
  handleJoinClub,
  handleUserToAdmin,
  validateAdmin,
  handleDeleteMsg,
  handleUpdateMsgTimeStamp,
};
