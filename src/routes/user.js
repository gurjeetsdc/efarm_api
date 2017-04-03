var express = require('express');
var router  = express.Router();

var authController   = require('../controllers/auth');
var userController   = require('../controllers/user');

/**
* @swagger
* /users:
*   get:
*     description: get the list of all the registered users
*     tags: [Default]
*     responses:
*       200:
*         description: API is working.
*         schema:
*           type: object
*/
router.get('/users',authController.isAuthenticated, userController.getUsers);


/**
* @swagger
* /users:
*   post:
*     description: Add new user to the user collection
*     tags: [Default]
*     responses:
*       200:
*         description: API is working.
*         schema:
*           type: object
*/
router.post('/users', userController.postUsers);
// router.post('/users',authController.isAuthenticated, userController.postUsers);


module.exports = router;