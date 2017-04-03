// Load required packages
var mongoose = require('mongoose');

// Define our refreshtoken schema
var refreshtokenSchema   = new mongoose.Schema({
    refreshToken: { type: String, required: true },        
    userId: { type: String, required: true },
    clientId: { type: String, required: true }        
});

// Export the Mongoose model
module.exports = mongoose.model('refreshtoken', refreshtokenSchema);