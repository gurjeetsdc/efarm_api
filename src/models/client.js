// Load required packages
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// Define our client schema
var ClientSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, },
    secret: { type: String, required: true },
    userId: { type: String, required: true },
    created: {type: Date, default: Date.now },
    updated: {type: Date, default: Date.now }

});


// Execute before each user.save() call
ClientSchema.pre('save', function(callback) {
  var client = this;

  // Break out if the secret hasn't changed
  if (!client.isModified('secret')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(client.secret, salt, null, function(err, hash) {
      if (err) return callback(err);
      client.secret = hash;
      callback();
    });
  });
});


ClientSchema.methods.verifySecret = function(secret, cb) {
  bcrypt.compare(secret, this.secret, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Export the Mongoose model
module.exports = mongoose.model('Client', ClientSchema);