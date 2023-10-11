// user authentication for reirection to changin URL

// for Login
const isLogin = async (req, res, next) => {
  try {
    if (req.session.user) {
    } else {
      res.redirect("/");
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};

// for Logout
const isLogout = async (req, res, next) => {
  try {
    if (req.session.user) {
      res.redirect("/dashboard");
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  isLogin,
  isLogout,
};
