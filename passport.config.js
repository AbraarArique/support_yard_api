const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('./models/user');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.validPassword(password))) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  } catch (err) {
    return done(err);
  }
}));

passport.use(new JwtStrategy({
  secretOrKey: process.env.JWT_SEC,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.user.id);
    if (!user) {
      return done(null, false);
    } else {
      return done(null, user);
    }
  } catch (err) {
    return done(err);
  }
}));
