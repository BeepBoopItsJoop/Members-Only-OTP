const { validatePost } = require("../validators/validatePost");
const db = require("../db/queries");
const { validationResult } = require("express-validator");
const { formatDistance } = require('date-fns'); 

// Implement pages of posts so we  dont query every single post
const postsListGet = async (req, res) => {
  let posts = req.user?.member
    ? await db.postList()
    : await db.postListNoInfo();

     posts = posts.map((post) => ({
          ...post,
          timestamp: post.timestamp ? formatDistance(post.timestamp, Date.now(), { addSuffix: true }) : null,
     }));

  res.render("postsPage", { posts: posts });
};

const postGet = async (req, res) => {
  const postID = req.params.id;
  let post = req.user?.member
    ? await db.post(postID)
    : await db.postNoInfo(postID);

  if (!post) {
    const error = new Error("Post not found");
    error.statusCode = 404;
    throw error;
  }

  if(post.timestamp) {
       post.timestamp = formatDistance(new Date(post.timestamp), new Date(), { addSuffix: true });
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
    const timestamp = new Date()
//     console.log(`Title - ${posttitle}`, `Post - ${postbody}`, `ID - ${id}, Date - ${timestamp}`);
    await db.addPost(posttitle, postbody, id, timestamp);

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
