function handleLogOut(req, res, next) {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    return res.status(200).json({ redirect: "/" });
  });
}
export { handleLogOut };
