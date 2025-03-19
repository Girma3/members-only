import newPool from "./pool.js";

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
      "UPDATE users SET member = true WHERE id = $1",
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
/*async function getAllMessages() {
  try {
    const { rows } = await newPool.query("SELECT * FROM messages");
    return rows;
  } catch (err) {
    console.log(err, "err while getting all messages from db");
  }
}
*/
async function deleteUser(userId) {
  try {
    const { rows } = await newPool.query("DELETE FROM users WHERE id=$1", [
      userId,
    ]);
    return true;
  } catch (err) {
    console.log(err, "err while removing user from db");
  }
}
async function deleteMessage(msgId) {
  try {
    const { rows } = await newPool.query("DELETE FROM messages WHERE id=$1", [
      msgId,
    ]);
    return true;
  } catch (err) {
    console.log(err, "err while removing msg from db");
  }
}

async function addMessages(userId, text) {
  //format time here
  let createdTime = new Date().toISOString();
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
async function getAllMessages() {
  /*  message form adjusted  in this form:
  const messages = [
    { id: 1, author: "king", text: "Good Day", timeStamp: "date" },
  ];
  */
  try {
    const { rows } = await newPool.query(
      `SELECT 
        messages.id, 
        users.name AS author, 
        messages.text, 
        messages.timestamp AS timeStamp 
      FROM messages 
      INNER JOIN users ON users.id = messages.user_id`
    );

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
  addMessages,
  deleteMessage,
};
