const { Router } = require("express");

const indexRouter = Router();
const postsRouter = require("./postsRouter");

const indexController = require("../controllers/indexController");
const { checkAuthentication } = require("../middlewares/authenticator");

indexRouter.use("/posts", postsRouter);

indexRouter.get("/", indexController.homeGet);

indexRouter.get("/register", indexController.registerGet);
indexRouter.post("/register", indexController.registerPost);

indexRouter.get("/log-in", indexController.logInGet);
indexRouter.post("/log-in", indexController.logInPost);

indexRouter.get("/log-out", indexController.logOutGet);

indexRouter.param('id', indexController.validateParamId);
indexRouter.get("/profile/:id", indexController.profileGet);

indexRouter.get("/become-member", checkAuthentication, indexController.becomeMemberGet);
indexRouter.post("/become-member", checkAuthentication, indexController.becomeMemberPost);

// TODO: Become admin


module.exports = indexRouter;
