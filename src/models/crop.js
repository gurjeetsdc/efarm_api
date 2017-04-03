// Load required packages
var mongoose = require('mongoose');

// Define our Crop schema
var CropSchema   = new mongoose.Schema({
    name: { type: String,required: true },
    type: { type: String,required: true },
    quantity: { type: Number,required: true },
    price: { type: String,required: true },
    userId: { type: String,required: true },
});

// Export the Mongoose model
module.exports = mongoose.model('Crop', CropSchema);