const { Router } = require("express");

const { checkAuthentication, checkIfMember, checkIfAdmin } = require("../middlewares/authenticator");
const { validateParamId } = require("../controllers/indexController");

const postsRouter = Router();
const postController = require("../controllers/postsController");

postsRouter.get("/", postController.postsListGet);

postsRouter.post("/new", checkIfMember, postController.postCreatePost);

postsRouter.param('id', validateParamId);
postsRouter.get("/:id", postController.postGet);
postsRouter.get("/:id/delete", checkIfAdmin, postController.postDeleteGet);
postsRouter.post("/:id/delete", checkIfAdmin, postController.postDeletePost);


// TODO: Add comments - db schema, form in view, add method

module.exports = postsRouter;
