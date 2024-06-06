const {Router} = require("express");

const router = Router();

const {
  handleCheckUser,
  handleCheckEmail,
  handleUserSingup,
  handleUserSignin,
} = require("../controllers/userController")


router.get('/check-user', handleCheckUser);

router.get('/check-email', handleCheckEmail);

router.post("/signup", handleUserSingup);

router.post("/signin", handleUserSignin);

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
