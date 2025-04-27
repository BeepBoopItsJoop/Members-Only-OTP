require("dotenv").config();
const express = require("express");
const app = express();
const pool = require("./db/pool");

const path = require("node:path");
// Auth
const passport = require("passport");
const sessionObject = require("./auth/sessionConfig");
const localStrategy = require("./auth/strategy");
const { deserializer, serializer } = require("./auth/transformers.js");

const globalErrorHandler = require("./middlewares/globalErrorHandler");
const notFoundHandler = require("./middlewares/notFoundHandler.js");
const { provideUser, provideSession} = require("./middlewares/provideUser.js");
const preventCache = require("./middlewares/preventCache.js");

const indexRouter = require("./routes/indexRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
// Session
app.use(sessionObject);
app.use(passport.session());
// Prevent caching so user cant go back to protected route after logging out
app.use(preventCache);
// Have currentUser and currentSession accessable everywhere and in views
app.use(
     provideUser,
     //  provideSession
);

// Routes
app.use("/", indexRouter);

passport.use(localStrategy);
passport.serializeUser(serializer);
passport.deserializeUser(deserializer);

app.use(globalErrorHandler);

// TODO: 404 handler
app.use(notFoundHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App running on port ${PORT}`));
