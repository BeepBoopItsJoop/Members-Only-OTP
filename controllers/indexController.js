const bcrypt = require("bcryptjs");
const passport = require("passport");

// Validation
const { validationResult } = require("express-validator");
const { validateUser } = require("../validators/validateUser");

const db = require("../db/queries");

const homeGet = (req, res) => {
  res.render("homePage", { user: req.user });
};

const registerGet = (req, res) => {
  res.render("formPage", { route: "register" });
};

const registerPost = [
     validateUser,
     (async (req, res) => {
          const errors = validationResult(req);
          if(!errors.isEmpty()) {
               return res.status(400).render("formPage", { 
                    route: "register", 
                    errors: errors.array(),
                    item: req.body, 
               });
          }

          const { username, displayname, password } = req.body;
          const hashedPassword = await bcrypt.hash(password, 10);

          await db.addUser(username, displayname, hashedPassword);
          res.redirect("/");
     })
];

const logInGet = (req, res) => {
     const errorMessages = req.session.messages;
     // Reset messages field of session after fialure redirect
     req.session.messages = [];
     res.render("formPage", { route: "log-in", errors: errorMessages });
};

const logInPost = passport.authenticate("local", {
  successRedirect: "/posts",
  failureRedirect: "/log-in",
  failureMessage: true,
});

const logOutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

const secretGet = (req, res) => {
  if (req.isAuthenticated()) {
    res.send("logged in");
  } else {
    res.send("not logged in");
  }
};

module.exports = {
  homeGet,
  registerGet,
  registerPost,
  logInGet,
  logInPost,
  logOutGet,
  secretGet,
};
