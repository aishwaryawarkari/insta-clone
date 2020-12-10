const User = require("../../models/user");

exports.home = async (req, res, next) => {
  if (req.session.user) {
    const user = await User.findById(req.session.user._id);
    return res.render("home", { user });
  } else {
    res.redirect("/auth/login");
  }
};
