import express from "express";

import {
  handleHomePage,
  handleIntroPage,
  validateUser,
  handleSignIn,
  validateMsg,
  handleCreateMsg,
  validateLogIn,
  handleLogIn,
  validateJoinClub,
  handleJoinClub,
  handleMemberPage,
  handleAdminPage,
  handleUserToAdmin,
  validateAdmin,
  handleDeleteMsg,
  handleUpdateMsgTimeStamp,
} from "../controllers/control.js";
//import authenticateUser from "../middleware/authController.js";
import { handleLogOut } from "../authentication/authController.js";
import {
  ensureAuthenticated,
  isUserAdmin,
  isUserMember,
} from "../middleware/authenticateMiddleware.js";

const membersRoute = express.Router();

membersRoute.get("/", handleIntroPage);
membersRoute.post("/sign", validateUser, handleSignIn);
membersRoute.post(
  "/create/message",
  ensureAuthenticated,
  validateMsg,
  handleCreateMsg
);

membersRoute.post("/log-in", validateLogIn, handleLogIn);
membersRoute.get("/home", ensureAuthenticated, handleHomePage);
membersRoute.get("/member", isUserMember, handleMemberPage);
membersRoute.post(
  "/join-club",
  ensureAuthenticated,
  validateJoinClub,
  handleJoinClub
);
//
membersRoute.post("/admin", isUserMember, validateAdmin, handleUserToAdmin);
membersRoute.get("/admin-page", isUserAdmin, handleAdminPage);
membersRoute.delete("/delete/message/:id", isUserAdmin, handleDeleteMsg);

//send messages as json to update time stamp periodically
membersRoute.get("/api/messages", handleUpdateMsgTimeStamp);

membersRoute.get("/log-out", handleLogOut, handleIntroPage);

membersRoute.get("*", (req, res) => {
  res.render("404", { msg: "page not found " });
});
//

export default membersRoute;
