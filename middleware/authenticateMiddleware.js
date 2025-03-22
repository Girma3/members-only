import bcrypt from "bcryptjs";
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "User is not logged in." });
}
function isUserAdmin(req, res, next) {
  if (req.user && req.user.admin === true) {
    return next();
  }
  return res.status(401).json({ message: "user is not an Admin" });
}
function isUserMember(req, res, next) {
  if (req.user && req.user.member === true) {
    return next();
  }
  return res.status(401).json({ message: "user is not a member" });
}
async function hashPassword(password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (err) {
    console.error("Error while hashing password:", err);
    throw err;
  }
}

export { ensureAuthenticated, isUserAdmin, isUserMember, hashPassword };
