const globalErrorHandler = (err, req, res, next) => {
     console.log("test - global error");
     console.error(err);
     
     if(err.statusCode === 404) {
          res.status(404);
          return res.render("404", { error: err })
     }

     res.status(500).send("Something went wrong")
}


module.exports = globalErrorHandler
