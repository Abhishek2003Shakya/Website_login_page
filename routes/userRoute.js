const express = require("express");
const user_route = express();

const bodyParser = require("body-parser");

// //  .env session setup
const session = require("express-session");
const { SESSION_SECRET } = process.env;
user_route.use(session({ secret: SESSION_SECRET }));

user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

user_route.set("view engine", "ejs");
user_route.set("views", "./views");

user_route.use(express.static("public"));

const path = require("path");
// multer set-up
const multer = require("multer");

// setup storage for storing img
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
  },
  filename: function (req, file, cb) {
    const name =
      Date.now() + "-" + file.originalname + "." + file.mimetype.split("/")[1];
    cb(null, name);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/gif" ||
    file.mimetype == "image/jpg"
  ) {
    cb(null, true);
    req._s = true;
  } else {
    req._s = false;
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

const userController = require("../controllers/userController");

// adding middlewares
const auth = require("../middlewares/auth");

// register route
user_route.get("/register", auth.isLogout, userController.registerLoad);
user_route.post("/register", upload.single("image"), userController.register);

// // login route
// user_route.route("/")
// .get(userController.loadLogin, (req,res)=>{).post(userController.login, (req, res)=>{});

user_route.get("/", auth.isLogout, userController.loadLogin);
user_route.post("/", userController.login);
// logout route
user_route.get("/logout", auth.isLogin, userController.logout);
// dashboard route
user_route.get("/dashboard", auth.isLogin, userController.loadDashboard);

// in case user enter worng route we can redirect to "/"
user_route.get("*", function () {
  res.redirect("/");
});

module.exports = user_route;
