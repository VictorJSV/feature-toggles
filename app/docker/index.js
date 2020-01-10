'use strict';

const fs = require('fs');
const unleash = require('unleash-server');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AtlassianStrategy = require('passport-atlassian-oauth2');

passport.use(new AtlassianStrategy(
  {
    clientID: 'MAsNsI2T8W2wlxIUfaOThrTP5IUj0Y3P',
    clientSecret: 'FlRS8A4GzSw1rv1QgUd7RXmw73DRY9uqo5dbEbmIaL9dLrj3_bQCZjFmTEDTd_bF',
    callbackURL: 'http://localhost:4242/api/auth/callback',
    scope: 'read:jira-user'
  },
  function(accessToken, refreshToken, profile, cb) {
    cb(null, new unleash.User({
      name: profile.displayName,
      email: profile.email,
      imageUrl: profile.photo,
    }));
  }
));


const sharedSecret = '12312Random';
let options = {
  enableLegacyRoutes: false,
  adminAuthentication: 'custom',
  preRouterHook: app => {
    // app.use('/api/client', (req, res, next) => {
    //   console.log('-->', req.header('authorization'));
    //   if (req.header('authorization') !== sharedSecret) {
    //       res.sendStatus(401);
    //   } else {
    //       next();
    //   }
    // });
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));
    app.get('/api/admin/login', passport.authenticate('atlassian'));
    app.get('/api/auth/callback',
      passport.authenticate('atlassian', {
        failureRedirect: '/api/admin/error-login',
      }),
      (req, res) => {
        // Successful authentication, redirect to your app.
        res.redirect('/');
      }
  );

  app.use('/api/admin/', (req, res, next) => {
      if (req.user) {
        next();
      } else {
        // Instruct unleash-frontend to pop-up auth dialog
        return res
          .status('401')
          .json(
            new unleash.AuthenticationRequired({
              path: '/api/admin/login',
              type: 'custom',
              message: `You have to identify yourself in order to use Unleash. Click the button and follow the instructions.`,
            })
          )
          .end();
      }
  });
  }
};

if (process.env.DATABASE_URL_FILE) {
  options.databaseUrl = fs.readFileSync(process.env.DATABASE_URL_FILE);
}

unleash.start(options).then(unleash => {
  console.log(`Unleash started on http://localhost:${unleash.app.get('port')}`);
});;
