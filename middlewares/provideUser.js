const provideUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

const provideSession = (req, res, next) => {
  res.locals.currentSession = req.session;
  next();
};

module.exports = {
  provideUser,
  provideSession,
};
