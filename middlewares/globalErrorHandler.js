const globalErrorHandler = (err, req, res, next) => {
  console.error("Global error handler ->", err);

  if (err.statusCode === 404) {
    res.status(404);
    return res.render("404", { error: err });
  }


  res.status(500);
  res.render("500", { error: err });
};

module.exports = globalErrorHandler;
