const pool = require("./pool");

const postList = async () => {
  const SQL = `
     SELECT posts.id, posts.title, posts.text, posts.user_id, 
     posts.timestamp, users.user_name AS user_name
     FROM posts 
     JOIN users
     ON (posts.user_id = users.id);
     `;

  const { rows } = await pool.query(SQL);
  return rows;
};

const postListNoInfo = async () => {
  const SQL = `
     SELECT posts.id, posts.title, posts.text, posts.user_id
     FROM posts 
     JOIN users
     ON (posts.user_id = users.id);
     `;

  const { rows } = await pool.query(SQL);
  return rows;
};

const postListByUser = async (id) => {
  const SQL = `
     SELECT posts.id, posts.title, posts.text, posts.user_id, 
     posts.timestamp, users.user_name AS user_name
     FROM posts
     LEFT JOIN users
     ON (posts.user_id = users.id)
     WHERE posts.user_id = $1;
     `;

  const { rows } = await pool.query(SQL, [id]);
  return rows;
};

const postListByUserNoInfo = async (id) => {
  const SQL = `
     SELECT posts.id, posts.title, posts.text, posts.user_id
     FROM posts
     LEFT JOIN users
     ON (posts.user_id = users.id)
     WHERE posts.user_id = $1;
     `;

  const { rows } = await pool.query(SQL, [id]);
  return rows;
};

const post = async (post_id) => {
  const SQL = `
     SELECT posts.id, posts.title, posts.text, posts.user_id, 
     posts.timestamp, users.user_name AS user_name
     FROM posts JOIN users
     ON (posts.user_id = users.id)
     WHERE posts.id = $1;
     `;
  const { rows } = await pool.query(SQL, [post_id]);
  return rows[0];
};

const postNoInfo = async (post_id) => {
  const SQL = `
     SELECT posts.id, posts.title, posts.text, posts.user_id
     FROM posts JOIN users
     ON (posts.user_id = users.id)
     WHERE posts.id = $1;
     `;

  const { rows } = await pool.query(SQL, [post_id]);
  return rows[0];
};

const deletePost = async (post_id) => {
  const SQL = `
     DELETE FROM posts
     WHERE id = $1;
     `;

  await pool.query(SQL, [post_id]);
};

const userByUsername = async (username) => {
  const SQL = `
     SELECT users.id, users.user_name, users.display_name, users.password, users.member, users.admin 
     FROM users 
     WHERE user_name = $1;
     `;

  const { rows } = await pool.query(SQL, [username]);
  return rows[0];
};

const userByID = async (id) => {
  const SQL = `
     SELECT users.id, users.user_name, users.display_name, users.password, users.member, users.admin
     FROM users 
     WHERE id = $1;
     `;

  const { rows } = await pool.query(SQL, [id]);
  return rows[0];
};

const addUser = async (username, displayName, password) => {
  if (await userByUsername(username)) {
    throw new Error("Tried adding duplicate user to database");
  }

  const SQL = `
     INSERT INTO users (user_name, display_name, password) VALUES ($1, $2, $3);
     `;

  await pool.query(SQL, [username, displayName, password]);
};

const addPost = async (title, body, authorID) => {
  const SQL = `
          INSERT INTO posts (title, text, user_id, timestamp) VALUES ($1, $2, $3, $4);
     `;

  await pool.query(SQL, [title, body, authorID, new Date()]);
};

const updateUserMember = async (id) => {
  const SQL = `
     UPDATE users SET member = true 
     WHERE id = $1;
     `;
  await pool.query(SQL, [id]);
};

const updateUserAdmin = async (id) => {
  const SQL = `
     UPDATE users SET admin = true
     WHERE id = $1;
     `;
  await pool.query(SQL, [id]);
};

module.exports = {
  postList,
  postListNoInfo,
  postListByUser,
  postListByUserNoInfo,
  post,
  postNoInfo,
  deletePost,
  userByUsername,
  userByID,
  addUser,
  addPost,
  updateUserMember,
  updateUserAdmin,
};
