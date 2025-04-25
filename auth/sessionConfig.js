const pool = require("../db/pool");
const expressSession = require("express-session");
const pgSession = require("connect-pg-simple")(expressSession);

// Session middleware
const sessionStore = new pgSession({
  pool: pool,
  tableName: "user_sessions",
  createTableIfMissing: true,
});

const sessionObject = expressSession({
  store: sessionStore,
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 7 days
});

module.exports = sessionObject;
