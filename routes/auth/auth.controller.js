const User = require("../../models/user");

const authValidator = require("./auth.validator");

exports.loginView = (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("login", { error: null });
};

exports.signupView = (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  }
  res.render("signup", { error: null });
};

exports.signup = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
    } = await authValidator.signup().validateAsync(req.body);

    const user = await User.create({ name, email, password });
    return res.redirect("/auth/login");
  } catch (error) {
    // next(error);
    return res.render("signup", { error: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      // return next("incorrect email or password");
      return res.render("login", { error: "incorrect email or password" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      // return next("incorrect email or password");
      return res.render("login", { error: "incorrect email or password" });
    }

    req.session.user = user;
    return res.redirect("/");
  } catch (error) {
    // next(error);
    return res.render("login", { error: error.message });
  }
};

exports.logout = (req, res, next) => {
  req.session.destroy();
  return res.redirect("/auth/login");
};
