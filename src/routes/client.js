var express = require('express');
var router  = express.Router();

var authController   = require('../controllers/auth');
var clientController = require('../controllers/client');

router.post('/clients', authController.isAuthenticated, clientController.postClients)
router.get('/clients', authController.isAuthenticated, clientController.getClients);

module.exports = router;