const db = require("../db/queries");
const NotFoundError = require("../errors/notFoundError");

const postsListGet = async (req, res, next) => {
     const posts = await db.postList();
     // if (posts.length === 0) {
     //      throw new NotFoundError("empty post list");
     // }
     res.render("postsPage", { posts: posts });

}

module.exports = {
     postsListGet
};
