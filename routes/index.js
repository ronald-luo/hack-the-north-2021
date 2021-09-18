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
      res.redirect('/auth/google')
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
router.get('/form', authCheck, function(req, res, next) {
  res.render('form', { title: 'Express', user: req.user });
});

/* image middle ware */
const uploadImage = multer({ dest: './public/data/uploads/' }).single('photo')

const imageScan = async (fileName) => {
  const vision = require('@google-cloud/vision')
  const client = new vision.ImageAnnotatorClient({
      keyFilename: './config/prescription-326300-78c8fe92d82c.json'
  });

  // Performs text detection on the local file
  const [result] = await client.textDetection(fileName);
  const detections = result.textAnnotations;
  var detectionlist = detections[0].description.split('\n')
  console.log(detectionlist)
  return detectionlist
}

/* POST upload page. */
router.post('/upload', uploadImage, function(req, res, next) {

  if (!req.file) {
    return res.json({msg: "file failed"})
  }

  // console.log(req.file)
  res.contentType('image/jpg');
  var imagePath = '/data/uploads/' + req.file.filename;
  res.json({img: `<img src="${imagePath}" />`})
  imageScan(req.file.path).catch(err => console.log(err))
});


router.post('/pass', function(req, res, next) {
  res.json({redirect: '/form'})
})


module.exports = router;
