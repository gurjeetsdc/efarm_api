var express = require('express');
var router  = express.Router();

var authController   = require('../controllers/auth');
var cropController   = require('../controllers/crop');

router.get('/crops',authController.isAuthenticated, cropController.getCrops);
router.post('/crops',authController.isAuthenticated, cropController.postCrops);

router.get('/crops/:crop_id', authController.isAuthenticated,cropController.getCrop);
router.put('/crops/:crop_id', authController.isAuthenticated, cropController.putCrop);
router.delete('/crops/:crop_id',authController.isAuthenticated, cropController.deleteCrop);

module.exports = router;