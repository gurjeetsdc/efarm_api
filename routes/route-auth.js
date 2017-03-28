var express = require('express');
var router  = express.Router();

/**
* @swagger
* /auth/login:
*   get:
*     description: Returns the login
*     tags: [Auth]
*     responses:
*       200:
*         description: API is working.
*         schema:
*           type: object
*/
router.get('/login', function(req, res, next) {
  res.json({message: "This is a dummy request" });
});

module.exports = router;
