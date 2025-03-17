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
    const { rows } = await newPool.query("UPDATE users SET member = true WHERE id = $1", [
      id,
    ]);
    return rows[0];
  } catch (err) {
    console.error("Error while updating user status:", err);
    throw err;
  }
  
}
async function updateUserToAdminById(id) {
  try {
    const { rows } = await newPool.query("UPDATE users SET admin = true WHERE id = $1", [
      id,
    ]);
    return rows[0];
  } catch (err) {
    console.error("Error while updating user status:", err);
    throw err;
  }
  
}

export { getUsers, getUserByName, getUserById ,updateUserStatusById,updateUserToAdminById};
