var express = require('express');
var router  = express.Router();

/**
* @swagger
* /:
*   get:
*     description: Returns the API information
*     tags: [Default]
*     responses:
*       200:
*         description: API is working.
*         schema:
*           type: object
*/
router.get('/', function(req, res, next) {
  res.json({users: [{name: 'Timmy'}]});
});

module.exports = router;