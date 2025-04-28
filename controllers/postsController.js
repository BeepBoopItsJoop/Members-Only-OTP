const { validatePost } = require("../validators/validatePost");
const db = require("../db/queries");
const { validationResult } = require("express-validator");

const postsListGet = async (req, res, next) => {
     const posts = (req.user?.member) 
     ? (await db.postList())
     : (await db.postListNoInfo());

     res.render("postsPage", { posts: posts });
};

const postCreatePost = [
     validatePost,
     (async (req, res, next) => {
          const errors = validationResult(req);
          if(!errors.isEmpty()) {
               const posts = (req.user?.member) 
               ? (await db.postList())
               : (await db.postListNoInfo());

               return res.status(400).render("postsPage", {
                    posts: posts,
                    item: req.body,
                    errors: errors.array(),
               })
          }          
          const { posttitle, postbody } = req.body;
          const id = req.user.id;
          // console.log(`Title - ${posttitle}`, `Post - ${postbody}`, `ID - ${id}`);
          await db.addPost(posttitle, postbody, id);

          res.redirect("/posts");
     })
]


// TODO:
// postlistget - only show author and post time if member

module.exports = {
     postsListGet,
     postCreatePost,

};
;
