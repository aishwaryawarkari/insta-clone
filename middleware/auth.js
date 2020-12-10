exports.isAuthenticated = (req, res, next) => {
    try {
        if (!req.session.user) {
            return next("not logged in");
        }

        req.user = req.session.user;
        
        next()
    } catch (error) {
        next(error);
    }
}