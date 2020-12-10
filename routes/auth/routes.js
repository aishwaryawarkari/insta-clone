const router = require("express").Router();
const authController = require("./auth.controller");

router.get("/login", authController.loginView);
router.get("/signup", authController.signupView);
router.post("/login", authController.login);
router.post("/signup", authController.signup);
router.get("/logout", authController.logout);
module.exports = router;
