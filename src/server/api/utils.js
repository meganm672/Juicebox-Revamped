function requireUser(req, res, next) {
    if (!req.user) {
      res.status(401);
      next({
        name: "MissingUserError",
        message: "You must be logged in to preform this action"
      });
    }
  
    next();
  }
  
  module.exports = {
    requireUser
  }