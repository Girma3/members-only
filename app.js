import express from "express";
import { membersRoute } from "./routes/route.js";
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(membersRoute);

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log("server running...");
});
