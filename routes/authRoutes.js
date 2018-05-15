const passport = require('passport');
const Authentication = require('../controllers/authentication')

const requireSignIn = passport.authenticate('local', { session: false });
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = (app) => {

  app.post('/signin', requireSignIn, Authentication.signin);
  app.post('/signup', Authentication.signup);

  app.get('/auth/google', passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  app.get('/auth/google/callback', passport.authenticate('google'));

  app.get('/auth/logout', (req, res) => {
    req.logout();
    res.send(req.user);
  });
}
