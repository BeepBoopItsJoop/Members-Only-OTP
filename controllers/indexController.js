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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("formPage", {
        route: "register",
        errors: errors.array(),
        item: req.body,
      });
    }

    const { username, displayname, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.addUser(username, displayname, hashedPassword);
    res.redirect("/log-in");
  },
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

const validateParamId = (req, res, next, id) => {
  if (isNaN(id)) {
    res.render("400", { message: "ID parameter must be a number" });
  } else {
    next();
  }
};

const profileGet = async (req, res) => {
  const profileID = req.params.id;
  const user = await db.userByID(profileID);
  const posts = req.user?.member
    ? await db.postListByUser(profileID)
    : await db.postListByUserNoInfo(profileID);

  if (!user) {
    res.render("404", { error: new Error("User can't be found") });
  }

  res.render("profilePage", { user: user, posts: posts });
};

const becomeMemberGet = (req, res) => {
  if (req.user.member) {
    return res.redirect("/posts");
  }
  res.render("membershipPage");
};

const becomeMemberPost = async (req, res) => {
  const id = req.user.id;
  await db.updateUserMember(id);
  res.redirect("/posts");
};

const becomeAdminGet = (req, res) => {
  if (req.user.admin) {
    return res.redirect("/posts");
  }
  res.render("adminPage");
};

const becomeAdminPost = async (req, res) => {
  const { secretcode: secret } = req.body;
  if (
    secret?.trim() ===
    "I swear not to abuse this power and wreck a lovely developer's production database (please)"
  ) {
    await db.updateUserAdmin(req.user.id);
    return res.redirect("/posts");
  }
  res.redirect("/become-admin");
};

module.exports = {
  homeGet,
  registerGet,
  registerPost,
  logInGet,
  logInPost,
  logOutGet,
  validateParamId,
  profileGet,
  becomeMemberGet,
  becomeMemberPost,
  becomeAdminGet,
  becomeAdminPost,
};
