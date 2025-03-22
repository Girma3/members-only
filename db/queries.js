import newPool from "./pool.js";
import { format } from "date-fns";
import { hashPassword } from "../middleware/authenticateMiddleware.js";

async function getUsers() {
  try {
    const { rows } = await newPool.query("SELECT * FROM users");
    return rows;
  } catch (err) {
    console.log(err, "err while fetching users");
  }
}
async function getUserByName(name) {
  try {
    const { rows } = await newPool.query(
      "SELECT * FROM users WHERE name = $1",
      [name]
    );
    return rows[0];
  } catch (err) {
    console.error("Error while fetching user using name:", err);
    throw err;
  }
}
async function getUserById(id) {
  try {
    const { rows } = await newPool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    return rows[0];
  } catch (err) {
    console.error("Error while fetching user using id:", err);
    throw err;
  }
}

async function updateUserStatusById(id) {
  try {
    const { rows } = await newPool.query(
      "UPDATE users SET member = true WHERE id = $1 RETURNING *",
      [id]
    );
    return rows[0];
  } catch (err) {
    console.error("Error while updating user status:", err);
    throw err;
  }
}
async function updateUserToAdminById(id) {
  try {
    const { rows } = await newPool.query(
      "UPDATE users SET admin = true WHERE id = $1",
      [id]
    );
    return rows[0];
  } catch (err) {
    console.error("Error while updating user status:", err);
    throw err;
  }
}

async function addUser(name, password) {
  try {
    const userPassword = await hashPassword(password);
    await newPool.query("INSERT INTO users (name,password)", [
      name,
      userPassword,
    ]);
  } catch (err) {
    console.log(err, "err while adding user to db");
  }
}

async function deleteUser(userId) {
  try {
    await newPool.query("DELETE FROM users WHERE id=$1", [userId]);
    return;
  } catch (err) {
    console.log(err, "err while removing user from db");
  }
}
// message db
async function addMessage(userId, text) {
  //format time here
  let createdTime = format(new Date(), "yyyy-MM-dd HH:mm:ss");
  try {
    const { rows } = await newPool.query(
      "INSERT INTO messages(user_id,text,timestamp) VALUES($1,$2,$3)",
      [userId, text, createdTime]
    );
    return rows;
  } catch (err) {
    console.log(err, "err while adding  messages to db");
  }
}
async function deleteMessage(msgId) {
  try {
    await newPool.query("DELETE FROM messages WHERE id=$1", [msgId]);
    return true;
  } catch (err) {
    console.log(err, "err while removing msg from db");
  }
}
//msg sort by newest first by default
async function getAllMessages(sortType = "DESC") {
  const sortBy = sortType === "DESC" ? "DESC" : "ASC";

  /*  message form adjusted  in this form:
  const messages = [
    { id: 1, author: "king", text: "Good Day", timeStamp: "date" },
  ];
  */
  try {
    const query = `
      SELECT 
        messages.id, 
        users.name AS author, 
        messages.text, 
        messages.timestamp AS timeStamp 
      FROM messages 
      INNER JOIN users ON users.id = messages.user_id 
      ORDER BY messages.id ${sortBy}`;

    const { rows } = await newPool.query(query);

    return rows;
  } catch (err) {
    console.error("Error while formatting messages:", err);
    throw err;
  }
}

export {
  getUsers,
  getUserByName,
  getUserById,
  updateUserStatusById,
  updateUserToAdminById,
  deleteUser,
  getAllMessages,
  addMessage,
  deleteMessage,
  addUser,
};
