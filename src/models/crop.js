// Load required packages
var mongoose = require('mongoose');

// Define our Crop schema
var CropSchema   = new mongoose.Schema({
   	name: { type: String, required: true},
	description: { type: String},
	variety: { type: String, required: true},
	offer_price: { type: Number, required: true, default: 0},
	offer_price_unit: { type: Number, required: true, default: 0},
	quantity: { type: Number, required: true, default: 0},
	quatity_unit: { type: String, required: true},
	service_fee: { type: Number},
	service_fee_type: { type: Number},
	discount_type: { type: String},
	discount_value: { type: Number},
	currency_cd: { type: String},
	timezone: { type: String},
	address_line1: { type: String},
	address_line2: { type: String},
	city: { type: String},
	state: { type: String},
	postal_code: { type: String},
	country: { type: String},
	lat: { type: Number},
	lng: { type: Number},
	images: { type: Array},
	status: { type: Boolean, default: false},
	is_verified: { type: Boolean, default: false},
	ready_on: { type: Date},
	expired: { type: Date},
	created: { type: Date, default: Date.now},
	created_by: { type: Date},
	modified: { type: Date, default: Date.now},
	modified_by: { type: String}
   
   	userId: { type: String,required: true },
});

// Export the Mongoose model
module.exports = mongoose.model('Crop', CropSchema);