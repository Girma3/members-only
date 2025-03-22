function handleLogOut(req, res, next) {
  req.logOut((err) => {
    if (err) {
      next(err);
    }
    next();
  });
}
export { handleLogOut };
