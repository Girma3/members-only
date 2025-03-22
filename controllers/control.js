import { body, validationResult } from "express-validator";
import {
  updateUserStatusById,
  updateUserToAdminById,
  getAllMessages,
  addMessage,
  deleteMessage,
  addUser,
  getUserById,
} from "../db/queries.js";
import authenticateUser from "../middleware/authController.js";
import { formatDistanceToNow } from "date-fns";
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
    .withMessage("confirm password must be 3 or more characters")
    .custom((value, { req }) => {
      if (value !== req.body.userPassword) {
        throw new Error("password doesn't match.");
      }
    }),
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
    .isLength({ min: 2 }) //adjust later
    .withMessage("password must be at least 3  characters"),
];
let joinPasscode = "Ethiopia".toLowerCase();
const validateJoinClub = [
  body("userJoinClub")
    .trim()
    .notEmpty()
    .withMessage("passcode can't be empty.")
    .isLength({ min: 8 })
    .withMessage("passcode must be 8 characters.")
    .custom((value) => {
      if (value.toLowerCase() !== joinPasscode) {
        throw new Error("Invalid passcode read the clue and try again");
      }
      return true;
    }),
];
const adminPasscode = "Inception".toLowerCase();
const validateAdmin = [
  body("adminPasscode")
    .trim()
    .notEmpty()
    .withMessage("passcode can't be empty.")
    .isLength({ min: 9 })
    .withMessage("pass code must be 9 characters.")
    .custom((value) => {
      if (value.toLowerCase() !== adminPasscode) {
        throw new Error("Invalid passcode read the clue and try again");
      }
      return true;
    }),
];
async function handleHomePage(req, res) {
  const sortBy = req.query.sortBy || "DESC";
  try {
    const messages = await getFormattedMessages(sortBy);
    res.render("home", {
      messages: messages,
      showAuthor: false,
      isAdmin: false,
      sort: sortBy,
    });
  } catch (err) {
    console.log(err, "err,while rendering home page");
  }
}
async function handleIntroPage(req, res) {
  const sortBy = req.query.sortBy || "DESC";
  try {
    const messages = await getFormattedMessages(sortBy);
    res.render("intro-page", {
      messages: messages,
      showAuthor: false,
      isAdmin: false,
      sort: sortBy,
    });
  } catch (err) {
    console.log(err, "err,while rendering intro page");
  }
}
async function handleMemberPage(req, res) {
  let msg;
  if (!req.session.views & !req.session.user.admin) {
    msg = `Hey, ${req.session.user.name} you are now officially a member of our club!🎉`;
    req.session.views = "1";
  }
  const sortBy = req.query.sortBy || "DESC";
  try {
    const messages = await getAllMessages(sortBy);
    res.render("member-page", {
      messages: messages,
      showAuthor: true,
      isAdmin: false,
      msg: msg,
      sort: sortBy,
    });
  } catch (err) {
    console.log(err, "err,while rendering member page");
  }
}
async function handleAdminPage(req, res) {
  const sortBy = req.query.sortBy || "DESC";
  try {
    const messages = await getFormattedMessages(sortBy);

    res.render("admin-page", {
      messages: messages,
      showAuthor: true,
      isAdmin: true,
      sort: sortBy,
    });
  } catch (err) {
    console.log(err, "err,while rendering admin page");
  }
}
async function handleDeleteMsg(req, res) {
  const { id } = req.params;
  try {
    await deleteMessage(id);
    res.status(200).json({ redirect: "/admin-page" }); //only admin can delete msg
  } catch (err) {
    console.log(err, "err,while deleting msg ");
  }
}
async function handleSignIn(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors });
  }
  const { userName, userPassword } = req.body;
  try {
    //add user to db
    await addUser(userName, userPassword);
    return res.status(200).json({ redirect: "/home" });
  } catch (err) {
    console.log(err, "err,while sign in");
  }
}
async function handleCreateMsg(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }
  const { userMessage } = req.body;
  const userId = req.session.user.id;

  try {
    //add msg to db
    await addMessage(userId, userMessage);
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

    //redirect to intro page
    return res.status(200).json({ redirect: "/" });
  } catch (err) {
    console.log(err, "err,while creating message");
  }
}
async function handleLogIn(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }
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
        redirect: "/home",
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
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    await updateUserStatusById(req.user.id);
    // fetch the updated user data and assign it to req.user
    const updatedUser = await getUserById(req.user.id);
    req.user = updatedUser;
    req.session.user = req.user;

    return res.status(200).json({ redirect: "/member" });
  } catch (err) {
    console.log(err, "err,while joining club.");
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
async function handleUserToAdmin(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ errors: errors.array() });
  }

  try {
    await updateUserToAdminById(req.user.id);
    // fetch the updated user data and assign it to req.user
    const updatedUser = await getUserById(req.user.id);
    req.user = updatedUser;
    req.session.user = req.user;
    return res.status(200).json({ redirect: "/admin-page" });
  } catch (err) {
    console.log(err, "err,while user to be an admin.");
    return res.status(402).json({ showAuthors: "false" });
  }
}
async function getFormattedMessages(sortBy) {
  if (!sortBy) sortBy = "DESC";
  try {
    const messages = await getAllMessages(sortBy);
    const formattedMsg = formatMessagesTimeStamp(messages);
    return formattedMsg;
  } catch (err) {
    console.log(err, "err while formatting msg timestamp");
  }
}

// Function to adjust timestamp for messages
function formatMessagesTimeStamp(messages) {
  return messages.map((message) => {
    const formattedMessage = {
      ...message,
      timestamp: formatDistanceToNow(message.timestamp, { addSuffix: true }),
    };
    return formattedMessage;
  });
}
async function handleUpdateMsgTimeStamp(req, res) {
  const sortBy = req.query.sortBy || "DESC";
  try {
    const messages = await getFormattedMessages(sortBy);
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
