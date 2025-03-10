async function handleHomePage(req, res) {
  try {
    res.render("home");
  } catch (err) {
    console.log(err, "err,while rendering home page");
  }
}
export{handleHomePage}
