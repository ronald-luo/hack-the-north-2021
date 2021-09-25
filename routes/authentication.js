var express = require('express');
const passport = require('passport');
var router = express.Router();
const moment = require('moment')

/* auth login. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* auth with google. */
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
}));

const makeEvent = async (rfToken) => {
  const {google} = require('googleapis')
  const {OAuth2} = google.auth
  const oAuth2Client = new OAuth2('ABC',         //Client id and Client secret
  'DEF')

  oAuth2Client.setCredentials({refresh_token: rfToken })


  const calendar = google.calendar({version: 'v3', auth:oAuth2Client})
  const eventStartTime = new Date()
  eventStartTime.setDate(eventStartTime.getDate() + 1)
  const eventEndTIme = new Date()
  eventEndTIme.setDate(eventEndTIme.getDate()+ 1)
  eventEndTIme.setMinutes(eventEndTIme.getMinutes() + 45)
  const recurrenceEnd = new Date()
  recurrenceEnd.setDate(recurrenceEnd.getDate()+20)
  recurrenceRule = moment(recurrenceEnd).format('YYYYMMDD')

  const event = {
      summary: "ALPORAZOLAM 0.5MG TABLETS",
      description: "TAKE ONE TABLET BY MOUTH 3X PER DAY",
      start:{
          dateTime: eventStartTime,
          timeZone: 'America/Denver'
      },
      end:{
          dateTime: eventEndTIme,
          timeZone: 'America/Denver'
      },
      recurrence: [`RRULE:FREQ=DAILY;UNTIL=${recurrenceRule}`],
      colorId: 1
  }

  calendar.freebusy.query({
      resource:{
          timeMin: eventStartTime,
          timeMax: eventEndTIme,
          timeZone: "America/Denver",
          items:[{id: 'primary'}]
      }
  }, (err, res)=>{
      if(err) return console.error('free busy err', err)
      const eventsArr = res.data.calendars.primary.busy
      if (eventsArr.length === 0) return calendar.events.insert({calendarId: 'primary', resource: event},
      err=>{
          if (err) return console.error('Error', err)

          return console.log('calendar event created')
      })
      return console.log('event not created because overlapping events')
  })
}

// router.get('/auth/calendar', passport.authenticate('google', {
//   scope: ['https://www.googleapis.com/auth/calendar']
// }, (req, res, next) => {
//   makeEvent('1//04bLfANpxnmSMCgYIARAAGAQSNwF-L9Ir9wfI9kQedC2eW0cUAIlq7zeIUrLR12TMXb2_6dpfJtFAyjW1_Gg8mRqGhdqGJ8VM30o');
// }))

router.post('/add-cal', function(req, res, next) {
  makeEvent('rftoken')
  res.json({redirect:'/dashboard'});
});


/* callback route for google to redirect to */
// router.get('/auth/calendar/redirect', 
//   passport.authenticate('google', { failureRedirect: '/dashboard' }),
//   function(req, res, next) {
//     res.redirect('/dashboard')
//   });

/* auth logout. */
router.get('/logout', function(req, res, next) {
  req.logout()
  res.redirect('/')
});

/* callback route for google to redirect to */
router.get('/auth/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    // res.redirect('/login');
    res.redirect('/dashboard')
    res.json({redirect:'/dashboard'})
  });
  

module.exports = router;
