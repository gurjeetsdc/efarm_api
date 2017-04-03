// Load required packages
var passport       = require('passport');
var BasicStrategy  = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy
var crypto         = require('crypto');

var User   = require('../models/user');
var Client = require('../models/client');

var AccessToken   = require('../models/accesstoken');



passport.use(new BasicStrategy(
    function(username, password, callback) {
        User.findOne({ username: username }, function (err, user) {
            if (err) { return callback(err); }

            // No user found with that username
            if (!user) { return callback(null, false); }

            // Make sure the password is correct
            user.verifyPassword(password, function(err, isMatch) {
                if (err) { return callback(err); }

                // Password did not match
                if (!isMatch) { return callback(null, false); }

                // Success
                return callback(null, user);
            });
        });
    }
));

// exports.isAuthenticated = passport.authenticate('basic', { session : false });
exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false });

passport.use('client-basic', new BasicStrategy(
    function(username, password, callback) {
        Client.findOne({ id: username }, function (err, client) {
            if (err) { return callback(err); }

            // No client found with that id or bad password
            if (!client ) { return callback(null, false); }

            // Make sure the secret is correct
            client.verifySecret(password, function(err, isMatch) {
                if (err) { return callback(err); }

                // Password did not match
                if (!isMatch) { return callback(null, false); }

                // Success
                return callback(null, client);
            });
            
            // Success
            // return callback(null, client);
        });
    }
));
exports.isClientAuthenticated = passport.authenticate('client-basic', { session : false });


passport.use(new BearerStrategy(
    function(accessToken, callback) {
        
        console.log('AccessToken');
        var accessTokenHash = crypto.createHash('sha1').update(accessToken).digest('hex');

        AccessToken.findOne({token: accessTokenHash }, function (err, token) {
            if (err) { return callback(err); }

            // No token found
            if (!token) { return callback(null, false); }

            if (new Date() > token.expirationDate) { callback(null, false) }

            User.findOne({ _id: token.userId }, function (err, user) {
                if (err) { return callback(err); }

                // No user found
                if (!user) { return callback(null, false); }

                // Simple example with no scope
                callback(null, user, { scope: '*' });
            });
        });
    }
));
exports.isBearerAuthenticated = passport.authenticate('bearer', { session: false });
