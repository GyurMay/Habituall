const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = require('../models/User');

function passwordsMatch(submittedPassword, storedPasswordHash) {
  return bcrypt.compareSync(submittedPassword, storedPasswordHash);
}

/*
  The following code runs at login time.

  The usernameField and passwordField options refer to the HTTP requests
  body parameter names. I've set this to look for an `username` parameter,
  but you may prefer to use a `username` parameter instead of an username.

  BEST PRACTICE: don't state why login failed to the user.
*/
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
  },
  (username, password, done) => {
    // console.log(username, password, "received-----")
    // password = bcrypt.hashSync(password, 10);
    Users.findOne({ username })
      .then((user) => {
        if(!user) {
          console.log('\n\nFailed Login: user does not exist\n\n');
          return done(null, false, { message: 'Failed Login' });
        }

        if(passwordsMatch(password, user.password) === false) {
          console.log('\n\nFailed Login: passwords did not match\n\n');
          return done(null, false, { message: 'Failed Login' });
        }

        console.log('\n\nSuccessful Login\n\n');
        user.password = null;
        return done(null, user, { message: 'Successfully Logged In!' });
      })
      .catch(err => { return done(err) });
  })
);

passport.serializeUser((user, done) => {
  console.log("serialization done")
  done(null, user.userId);
});

passport.deserializeUser((userId, done) => {
  console.log(userId, ":id from passport.deserialize outside")
  Users.findOne({userId})
    .then((user) => {
      console.log(user, "from passport.deserialize")
      if (!user) {
        done(null, false);
        return;
      }

      done(null, user);
      return;
    })
    .catch(err => done(err, null));
});

// Use this protect api routes that require a user to be logged in.
passport.isAuthenticated = () => (req, res, next) =>
{
  console.log('called isAuthenticaled', req.user)
  if(req.user) {
    return next() 
  }else{
    res.sendStatus(401);
  }
}

module.exports = passport;