const pool = require("./pool");

const postList = async () => {
     const SQL = `
     SELECT posts.id, posts.title, posts.timestamp, posts.text, posts.user_id, users.user_name AS user_name
     FROM posts 
     JOIN users
     ON (posts.user_id = users.id);
     `;

     const { rows } = await pool.query(SQL);
     return rows;
}

const userByUsername = async (username) => {
     const SQL = `
     SELECT users.id, users.user_name, users.display_name, users.password, users.member, users.admin 
     FROM users 
     WHERE user_name = $1;
     `;

     const { rows } = await pool.query(SQL, [username])
     return rows[0];
}

const userByID = async (id) => {
     const SQL = `
     SELECT users.id, users.user_name, users.display_name, users.password, users.member, users.admin
     FROM users 
     WHERE id = $1;
     `;

     const { rows } = await pool.query(SQL, [id]);
     return rows[0];
}

const addUser = async (username, displayName, password) => {
     if(await userByUsername(username)) {
          throw new Error("Tried adding duplicate user to database");
     };

     const SQL = `
     INSERT INTO users (user_name, display_name, password) VALUES ($1, $2, $3);
     `;

     await pool.query(SQL, [username, displayName, password]);
}

module.exports = {
     postList,
     userByUsername,
     userByID,
     addUser
};
