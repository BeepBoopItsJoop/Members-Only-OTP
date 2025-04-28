const checkAuthentication = (req, res, next) => {
     if(req.isAuthenticated()) {
          return next();
     } 
     res.redirect("/register");
}

const checkIfMember = (req, res, next) => {
     if(req.isAuthenticated() && req.user.member) {
          return next();
     }
     res.render("401", { message: "You do not have a membership." });
}

const checkIfAdmin = (req, res, next) => {
     if(req.isAuthenticated() && req.user.admin) {
          return next();
     }
     res.render("401", { message: "You lack admin priviliges." } );
}

module.exports = {
     checkAuthentication,
     checkIfMember,
     checkIfAdmin,
}
