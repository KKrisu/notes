module.exports = {

    handleFlashes: function(req, res, next) {
        // flashes with redirecting handling
        if(req.session.flash && Object.keys(req.session.flash).length > -1) {
            res.locals.flashMessages = req.flash();
        } else {
            res.locals.flashMessages = null;
        }

        next();
    },

    handleUserSession: function(req, res, next) {
        if (req.session.passport && req.session.passport.user) {
            // adding logged in user data to locals
            res.locals.user = req.session.passport.user;
        } else {
            // on debug mode (no login requred) there is no user object
            res.locals.user = {};
        }

        next();
    },

    requireLogin: function(req, res, next) {
        if (!config.session.loginRequired) {
            // debug mode, no login required
            return next();
        }

        if (req.session.passport && req.session.passport.user) {
            return next();
        }

        return res.send(403);
    },
};
