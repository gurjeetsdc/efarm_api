// Load required packages
var oauth2orize = require('oauth2orize');
var passport    = require('passport');
var crypto      = require('crypto');

/* Load Models */
var User        = require('../models/user');
var Client      = require('../models/client');

var AccessToken   = require('../models/accesstoken');
var RefreshToken  = require('../models/refreshtoken');

// Create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(function(client, callback) {
  return callback(null, client._id);
});

server.deserializeClient(function(id, callback) {
  Client.findOne({ _id: id }, function (err, client) {
    if (err) { return callback(err); }
    return callback(null, client);
  });
});

// Register supported grant types.
//
// OAuth 2.0 specifies a framework that allows users to grant client
// applications limited access to their protected resources.  It does this
// through a process of the user granting access, and the client exchanging
// the grant for an access token.

// Grant authorization codes.  The callback takes the `client` requesting
// authorization, the `redirectUri` (which is used as a verifier in the
// subsequent exchange), the authenticated `user` granting access, and
// their response, which contains approved scope, duration, etc. as parsed by
// the application.  The application issues a code, which is bound to these
// values, and will be exchanged for an access token.

server.grant(oauth2orize.grant.code(function(client, redirectUri, user, ares, callback) {
  // Create a new authorization code
  var code = new Code({
    value: uid(16),
    clientId: client._id,
    redirectUri: redirectUri,
    userId: user._id
  });

  // Save the auth code and check for errors
  code.save(function(err) {
    if (err) { return callback(err); }

    callback(null, code.value);
  });
}));

//Client Credentials
server.exchange(oauth2orize.exchange.clientCredentials(function(client, scope, callback) {
    
    var token            = uid(256);
    var refreshToken     = uid(256);

    var tokenHash        = crypto.createHash('sha1').update(token).digest('hex')
    var refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex')

    var expirationDate  = new Date( new Date().getTime() + (3600*1000) );
    
    // Create a new authorization code
    var accessToken = new AccessToken({
        token: tokenHash, 
        expirationDate: expirationDate, 
        clientId: client._id,                
        userId: client.userId,
        scope: ''
    });

    // Create a new authorization code
    var refreshTokenObj = new RefreshToken({
        refreshToken: refreshToken,                
        clientId: client._id,                
        userId: user._id
    });

    // Save the auth code and check for errors
    accessToken.save(function(err) {
        if (err) { return callback(err); }                
        
        refreshTokenObj.save(function(err) {
            if (err) return callback(err)
            callback(null, token, refreshToken, {expires_in: expirationDate})    
        });    
    });  

}))


//Resource owner password
server.exchange(oauth2orize.exchange.password(function (client, username, password, scope, callback) {
    console.log('password');
    User.findOne({username: username}, function (err, user) {
        if (err) return callback(err)
        if (!user) return callback(null, false)
        
        // Make sure the password is correct
        user.verifyPassword(password, function(err, isMatch) {
            if (err) { return callback(err); }

            // Password did not match
            if (!isMatch) { return callback(null, false); }

            var token            = uid(256);
            var refreshToken     = uid(256);

            var tokenHash        = crypto.createHash('sha1').update(token).digest('hex');
            var refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex');

            var expirationDate  = new Date( new Date().getTime() + (3600*1000) );
            
            // Create a new authorization code
            var accessToken = new AccessToken({
                token: tokenHash, 
                expirationDate: expirationDate, 
                clientId: client._id,                
                userId: user._id,
                scope: ''
            });

            // Create a new authorization code
            var refreshTokenObj = new RefreshToken({
                refreshToken: refreshTokenHash,                
                clientId: client._id,                
                userId: user._id
            });

            // Save the auth code and check for errors
            accessToken.save(function(err) {
                if (err) { return callback(err); }                
                
                refreshTokenObj.save(function(err) {
                    
                    console.log("refreshtoken Saved: "+refreshTokenHash);
                    if (err) return callback(err)
                    callback(null, token, refreshToken, {expires_in: expirationDate})    
                });    
            });                        
        });
    });        
}));

//Refresh Token
server.exchange(oauth2orize.exchange.refreshToken(function (client, refreshToken, scope, callback) {
    
    console.log('refreshToken');
    var refreshTokenHash = crypto.createHash('sha1').update(refreshToken).digest('hex');

    RefreshToken.findOne({refreshToken: refreshTokenHash}, function (err, token) {
        if (err) {return callback(err)            }
        if (!token) {return callback(null, false)}
     
        if (client._id != token.clientId) {return callback(null, false)}


        
        var newAccessToken  = uid(256)
        var accessTokenHash = crypto.createHash('sha1').update(newAccessToken).digest('hex')
        var expirationDate  = new Date(new Date().getTime() + (3600*1000))
        scope               = '';


        AccessToken.update({userId: token.userId}, {$set: {token: accessTokenHash, scope: scope, expirationDate: expirationDate}}, function (err) {
            if (err) return callback(err)
            callback(null, newAccessToken, refreshToken, {expires_in: expirationDate});
        });
    });
}));

// user authorization endpoint
exports.authorization = [
  server.authorization(function(clientId, redirectUri, callback) {
    console.log("I am in -- AUTH 1");

    Client.findOne({ id: clientId }, function (err, client) {
      if (err) { return callback(err); }

      return callback(null, client, redirectUri);
    });
  }),
  function(req, res){
    console.log("I am in -- AUTH 2");
    res.render('dialog', { transactionID: req.oauth2.transactionID, user: req.user, client: req.oauth2.client });
  }
]

// user decision endpoint
exports.decision = [
  server.decision()
]

// token endpoint
exports.token = [ 
  passport.authenticate(['client-basic'], { session: false }),
  server.token(),
  server.errorHandler()
]

/**
 * Return a unique identifier with the given `len`.
 *
 *     utils.uid(10);
 *     // => "FDaS435D2z"
 *
 * @param {Number} len
 * @return {String}
 * @api private
 */
function uid (len) {
  var buf = []
    , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

/**
 * Return a random int, used by `utils.uid()`
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
