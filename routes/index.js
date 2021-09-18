var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing', { title: 'Express' });
});

/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  res.render('dashboard', { title: 'Express' });
});

/* GET home page. */
router.get('/form', function(req, res, next) {
  res.render('form', { title: 'Express' });
});



module.exports = router;
