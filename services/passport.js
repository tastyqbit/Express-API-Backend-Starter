const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {

  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      return done(null, user);
    });
  });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: keys.jwtTokenSecret
};

const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {

  User.findById(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

const googleLogin = new GoogleStrategy({
  clientID: keys.googleClientID,
  clientSecret: keys.googleClientSecret,
  callbackURL: '/auth/google/callback'
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleID: profile.id }).then((existingUser) => {
      if(existingUser) {
        done(null, existingUser);
      } else {
        new User({ googleID: profile.id })
          .save()
          .then(user => done(null, user));
      }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);
passport.use(googleLogin);
