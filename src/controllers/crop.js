// Load required packages
var Crop = require('../models/crop');

// Create endpoint /api/beers for POST
exports.postCrops = function(req, res) {
    // Create a new instance of the Crop model
    var crop = new Crop();

        // Set the beer properties that came from the POST data
    crop.name     = req.body.name;
    crop.type     = req.body.type;
    crop.quantity = req.body.quantity;
    crop.price    = req.body.price;
    crop.userId   = req.user._id;

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