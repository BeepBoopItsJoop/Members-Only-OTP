const { validatePost } = require("../validators/validatePost");
const db = require("../db/queries");
const { validationResult } = require("express-validator");

const postsListGet = async (req, res) => {
  const posts = req.user?.member
    ? await db.postList()
    : await db.postListNoInfo();

  res.render("postsPage", { posts: posts });
};

const postGet = async (req, res) => {
  const postID = req.params.id;
  const post = req.user?.member
    ? await db.post(postID)
    : await db.postNoInfo(postID);

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  res.render("postPage", { post: post, admin: req.user?.admin });
};

const postCreatePost = [
  validatePost,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const posts = req.user?.member
        ? await db.postList()
        : await db.postListNoInfo();

      return res.status(400).render("postsPage", {
        posts: posts,
        item: req.body,
        errors: errors.array(),
      });
    }
    const { posttitle, postbody } = req.body;
    const id = req.user.id;
    // console.log(`Title - ${posttitle}`, `Post - ${postbody}`, `ID - ${id}`);
    await db.addPost(posttitle, postbody, id);

    res.redirect("/posts");
  },
];

const postDeleteGet = (req, res) => {
  const id = req.params.id;

  res.render("confirmationPage", {
    route: `/posts/${id}/delete`,
    text: "Are you sure you want to delete this post?",
    title: "Delete post",
  });
};

const postDeletePost = async (req, res) => {
  const id = req.params.id;

  await db.deletePost(id);
  res.redirect("/posts/");
};

module.exports = {
  postsListGet,
  postGet,
  postCreatePost,
  postDeleteGet,
  postDeletePost,
};
