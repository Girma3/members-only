import express from "express";
import {
  handleHomePage,
  validateUser,
  handleSignIn,
  validateMsg,
  handleCreateMsg,
} from "../controllers/control.js";

const membersRoute = express.Router();

membersRoute.get("/", handleHomePage);
membersRoute.post("/sign", validateUser, handleSignIn);
membersRoute.post("/create/message", validateMsg, handleCreateMsg);
export { membersRoute };
