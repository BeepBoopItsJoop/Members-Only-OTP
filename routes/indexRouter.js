const { Router } = require("express");

const indexRouter = Router();
const postsRouter = require("./postsRouter");
const indexController = require("../controllers/indexController");

const passport = require("passport");

indexRouter.get("/", indexController.homeGet);

indexRouter.get("/register", indexController.registerGet);
indexRouter.post("/register", indexController.registerPost);

indexRouter.get("/log-in", indexController.logInGet);
indexRouter.post("/log-in", indexController.logInPost);

indexRouter.get("/log-out", indexController.logOutGet);

indexRouter.get("/secret", indexController.secretGet);

indexRouter.use("/posts", postsRouter);

//  get membership

module.exports = indexRouter;
