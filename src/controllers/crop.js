// Load required packages
var Crop = require('../models/crop');

// Create endpoint /api/beers for POST
exports.postCrops = function(req, res) {
    // Create a new instance of the Crop model
    var crop = new Crop();

        // Set the beer properties that came from the POST data
        crop.name             = req.body.name;
        crop.description      = req.body.description;
        crop.variety          = req.body.variety;
        crop.offer_price      = req.body.offer_price;
        crop.offer_price_unit = req.body.offer_price_unit;
        crop.quantity         = req.body.quantity;
        crop.quatity_unit     = req.body.quatity_unit;
        crop.service_fee      = req.body.service_fee;
        crop.service_fee_type = req.body.service_fee_type;
        crop.discount_type    = req.body.discount_type;
        crop.discount_value   = req.body.discount_value;
        crop.currency_cd      = req.body.currency_cd;
        crop.timezone         = req.body.timezone;
        crop.address_line1    = req.body.address_line1;
        crop.address_line2    = req.body.address_line2;
        crop.city             = req.body.city;
        crop.state            = req.body.state;
        crop.postal_code      = req.body.postal_code;
        crop.country          = req.body.country;
        crop.lat              = req.body.lat;
        crop.lng              = req.body.lng;
        crop.images           = req.body.images;
        crop.status           = req.body.status;
        crop.is_verified      = req.body.is_verified;
        crop.ready_on         = req.body.ready_on;
        crop.expired          = req.body.expired;
        crop.created          = req.body.created;
        crop.created_by       = req.body.created_by;
        crop.modified         = req.body.modified;
        crop.modified_by      = req.body.modified_by;
        crop.userId           = req.user._id;

    // Save the beer and check for errors
    crop.save(function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'crop added to the Collection!', data: crop });
    });
};

// Create endpoint /api/beers for GET
exports.getCrops = function(req, res) {

    // Use the Crop model to find all crop
    Crop.find({ userId: req.user._id }, function(err, crops) {
        if (err)
            return res.send(err);

        res.json(crops);
    });
};

// Create endpoint /api/crops/:crop_id for GET
exports.getCrop = function(req, res) {
    // Use the Crop model to find a specific Crop
    Crop.find({ userId: req.user._id, _id: req.params.crop_id }, function(err, crop) {
        if (err)
          return res.send(err);

        res.json(crop);
    });
};

// Create endpoint /api/crops/:crop_id for PUT
exports.putCrop = function(req, res) {
    // Use the Crop model to find a specific crop
    Crop.update({ userId: req.user._id, _id: req.params.crop_id }, { quantity: req.body.quantity }, function(err, num, raw) {
        if (err)
            return res.send(err);

        res.json({ message: num + ' updated' });
    });
};



// Create endpoint /api/crop/:crop_id for DELETE
exports.deleteCrop = function(req, res) {
    // Use the Crop model to find a specific crop and remove it
    Crop.remove({ userId: req.user._id, _id: req.params.crop_id }, function(err) {
        if (err)
            return res.send(err);

        res.json({ message: 'Crop removed from the Collection!' });
    });
};


exports.testCrop = function(req, res) {
    // Use the Crop model to find a specific Crop
    Crop.find({ userId: req.user._id, _id: req.params.crop_id }, function(err, crop) {
        if (err)
          return res.send(err);

        res.json(crop);
    });
};