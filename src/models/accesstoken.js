// Load required packages
var mongoose = require('mongoose');

// Define our accessToken schema
var accessTokenSchema   = new mongoose.Schema({
    token: { type: String, required: true },        
    userId: { type: String, required: true },
    clientId: { type: String, required: true },    
    expirationDate: { type: Date, required: true},
    scope: { type: String }
});

// Export the Mongoose model
module.exports = mongoose.model('accesstoken', accessTokenSchema);