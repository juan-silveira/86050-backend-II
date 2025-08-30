const passport = require('passport');

const authenticate = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (err, user, info) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            
            if (!user) {
                return res.status(401).json({ 
                    error: info ? info.message : 'Authentication failed' 
                });
            }
            
            req.user = user;
            next();
        })(req, res, next);
    };
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        
        next();
    };
};

module.exports = {
    authenticate,
    authorize
};