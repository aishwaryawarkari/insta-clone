const express = require("express");
const router = express.Router();
const authRoutes = require("./auth/routes");
const homeRoutes = require("./home/routes");
const postRoutes = require("./post/routes");
const userRoutes = require("./user/routes")

router.use("/auth", authRoutes);
router.use("/posts", postRoutes);
router.use("/users", userRoutes)
router.use("/", homeRoutes);

// router.get("/", (req, res) => {
//   res.render("login", {
//     user: {
//       name: "aish",
//       age: 25,
//     },
//   });
// });

module.exports = router;
