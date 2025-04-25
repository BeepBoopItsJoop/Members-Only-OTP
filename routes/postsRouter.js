const { Router } = require('express');

const postsRouter = Router();
const postController = require("../controllers/postsController");

postsRouter.get("/", postController.postsListGet);

module.exports = postsRouter;
