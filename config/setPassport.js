const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/user')

passport.serializeUser((user, done) => {
    done(null, user.id);
})

passport.deserializeUser((id, done) => {
    User.findById(id)
    .then((user) => {
        done(null, user);
    })
})

passport.use(new GoogleStrategy({
    // strategy options
    callbackURL: '/auth/google/redirect',
    clientID: '681849584592-ndpaqgu5bvi8n0g79rkjtbrahn020f57.apps.googleusercontent.com',
    clientSecret: 'IZlaM2wcllo2ma30yYVXFLGV'
    }, (accessToken, refreshToken, profile, done) => {
        // check if user already exists
        User.findOne({googleId: profile.id}).then((currentUser) => {
            if (currentUser) {
                // the current user
                console.log(profile)
                console.log('user is ' + currentUser)
                done(null, currentUser);
            } else {
                // create new user
                console.log(profile)
                new User({
                    name: profile.displayName,
                    googleId: profile.id,
                    photo: profile.photos[0].value
                }).save()
                .then((newUser) => {
                    console.log('new user created' + newUser)
                    done(null, newUser);
                })
            }
        })

    })
)
