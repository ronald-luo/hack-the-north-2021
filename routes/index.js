var express = require('express');
var router = express.Router();
const multer = require('multer');

let temp = ""
const imageScan = async(fileName) => {
  const vision = require('@google-cloud/vision')
  const client = new vision.ImageAnnotatorClient({
    keyFilename: './config/prescription-326300-78c8fe92d82c.json'
  });

  // Performs label detection on the image file
  // const fileName = 'resources/drugs.png';

  // Performs text detection on the local file
  const [result] = await client.textDetection(fileName);
  const detections = result.textAnnotations;
  var detectionlist = detections[0].description.split('\n')
  console.log(detectionlist)
  var stringss = detections[0].description.split('\n');
  var fillInTheBlank = {
          qty:'',
          startDate:'',
          instructions: '',
          drugName: '',
          refills: ''
      }
      for (let i = 0; i < stringss.length; i++){
          // console.log(stringss[i])
          if(/qty/i.test(stringss[i])){
              fillInTheBlank.qty = stringss[i].match(/[0-9]+/)[0]
          }
          else if(/(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(stringss[i])){
              temp = ''
              for (let a = 0; a < stringss[i].length; a++){
                  if (!(/^[A-Za-z]+$/.test(stringss[i][a]))){
                      temp = temp.concat(stringss[i][a])
                  }
              }
              fillInTheBlank.startDate = temp
          }
          else if(/refill/i.test(stringss[i])){
              fillInTheBlank.refills = stringss[i].match(/[0-9]+/)[0]
          }
          else if(/take/i.test(stringss[i])){
              fillInTheBlank.instructions = stringss[i]
              if (!/daily/i.test(stringss[i]) || !/day/i.test(stringss[i])){
                  fillInTheBlank.instructions = fillInTheBlank.instructions.concat(' '.concat(stringss[i+1]))
              }
          }
          else if(stringss[i].includes('TAB')){
              fillInTheBlank.drugName = stringss[i]
          }
      }
  temp = fillInTheBlank
  // console.log(temp)
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('landing', { title: 'Daily Dose' });
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
  res.render('dashboard', { title: 'User Dashboard', user: req.user });
});

/* GET home page. */
router.get('/form', authCheck, function(req, res, next) {
  // const drug = imageScan(req.file.path).catch(err => console.log(err))
  // const temp1 = temp.then((resp) => resp.json())
  // console.log('temp1 is ' + temp1)
  res.render('form', { title: 'Add Medication', user: req.user, drug: temp });
});

/* image middle ware */
const uploadImage = multer({ dest: './public/data/uploads/' }).single('photo')

// const imageScan = async (fileName) => {
//   const vision = require('@google-cloud/vision')
//   const client = new vision.ImageAnnotatorClient({
//       keyFilename: './config/prescription-326300-78c8fe92d82c.json'
//   });

//   // Performs text detection on the local file
//   const [result] = await client.textDetection(fileName);
//   const detections = result.textAnnotations;
//   var detectionlist = detections[0].description.split('\n')
//   console.log(detectionlist)
//   return detectionlist
// }


/* POST upload page. */
router.post('/upload', uploadImage, function(req, res, next) {

  if (!req.file) {
    return res.json({msg: "file failed"})
  }

  // console.log(req.file)
  res.contentType('image/jpg');
  var imagePath = '/data/uploads/' + req.file.filename;
  res.json({img: `<img src="${imagePath}" />`})
  res.render('/form', {drug: temp})
  imageScan(req.file.path).catch(err => console.log(err))
});


router.post('/pass', function(req, res, next) {
  console.log('temp went this way ' + temp)
  res.json({redirect: '/form'})
})


module.exports = router;
