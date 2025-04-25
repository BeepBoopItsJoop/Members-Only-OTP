const bcrypt = require("bcryptjs");
const passport = require("passport");

const db = require("../db/queries");

const homeGet = (req, res) => {
     res.render("homePage", { user: req.user });
}

const registerGet = (req, res) => {
     res.render("signUpForm")
}

const registerPost = async (req, res, next) => {
     const hashedPassword = await bcrypt.hash(req.body.password, 10);
     const username = req.body.username;
     const displayname = req.body.displayname;


     const existingUser = await db.userByUsername(username);

     if (existingUser) {
          return res.status(400).send("Username already exists");
     }

     await db.addUser(username, displayname, hashedPassword);
     res.redirect("/");

}

const logInGet = (req, res) => {
     res.render("logInForm");
}

const logInPost = passport.authenticate("local", {
     successRedirect: "/posts",
     failureRedirect: "/log-in"
});

const logOutGet = (req, res, next) => {
     req.logout((err) => {
          if (err) {
               return next(err);
          }
          res.redirect("/");
     });
}

const secretGet = (req, res) => {
     if(req.isAuthenticated()) {
          res.send('logged in');
     } else {
          res.send('not logged in')
     }
}

module.exports = {
     homeGet,
     registerGet,
     registerPost,
     logInGet,
     logInPost,
     logOutGet,
     secretGet,
};
