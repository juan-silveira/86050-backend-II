const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

const localStrategy = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            
            const isValidPassword = user.comparePassword(password);
            
            if (!isValidPassword) {
                return done(null, false, { message: 'Invalid password' });
            }
            
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
);

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret_key'
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await User.findById(payload.id).populate('cart');
        
        if (user) {
            return done(null, user);
        }
        
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
});

const currentStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await User.findById(payload.id).populate('cart');
        
        if (user) {
            return done(null, user);
        }
        
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
});

passport.use('register', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;
            
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return done(null, false, { message: 'User already exists' });
            }
            
            const Cart = require('../models/Cart');
            const newCart = await Cart.create({ products: [] });
            
            const newUser = await User.create({
                first_name,
                last_name,
                email,
                age,
                password,
                cart: newCart._id
            });
            
            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }
));

passport.use('login', localStrategy);
passport.use('jwt', jwtStrategy);
passport.use('current', currentStrategy);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;