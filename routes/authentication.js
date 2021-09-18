var express = require('express');
const passport = require('passport');
var router = express.Router();

/* auth login. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* auth with google. */
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
}));

/* auth logout. */
router.get('/logout', function(req, res, next) {
  req.logout()
  res.redirect('/')
});

/* callback route for google to redirect to */
router.get('/auth/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    // res.redirect('/login');
    res.redirect('/dashboard')
  });
  

module.exports = router;
