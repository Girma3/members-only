import express from "express";
import { handleHomePage } from "../controllers/control.js";

const membersRoute = express.Router();

membersRoute.get("/", handleHomePage);
export { membersRoute };
