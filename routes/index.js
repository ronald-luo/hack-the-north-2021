var express = require('express');
var router = express.Router();
const multer = require('multer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing', { title: 'Express' });
});

const authCheck = (req,res,next) => {
  if (!req.user) {
      // they are not logged in
      res.redirect('/login')
  } else {
      next()
  }
}

/* GET home page. */
router.get('/dashboard', authCheck, function(req, res, next) {
  console.log(req.user)
  res.render('dashboard', { title: 'Express', user: req.user });
});

/* GET home page. */
router.get('/form', function(req, res, next) {
  res.render('form', { title: 'Express' });
});

/* image middle ware */
const uploadImage = multer({ dest: './public/data/uploads/' }).single('photo')

/* POST upload page. */
router.post('/upload', uploadImage, function(req, res, next) {

  if (!req.file) {
    return res.json({msg: "file failed"})
  }

  console.log(req.file)
  res.contentType('image/jpg');
  var imagePath = '/data/uploads/' + req.file.filename;
  res.json({img: `<img src="${imagePath}" />`})
  res.render('form')
});



module.exports = router;
