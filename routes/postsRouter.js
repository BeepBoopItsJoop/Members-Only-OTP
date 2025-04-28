const { Router } = require("express");

const { checkAuthenticaiton, checkIfMember, checkIfAdmin } = require("../middlewares/authenticator");

const postsRouter = Router();
const postController = require("../controllers/postsController");

postsRouter.get("/", postController.postsListGet);

postsRouter.post("/new", checkIfMember, postController.postCreatePost);

// TODO:
// postcreatepost

module.exports = postsRouter;
