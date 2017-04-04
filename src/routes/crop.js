var express = require('express');
var router  = express.Router();

var authController   = require('../controllers/auth');
var cropController   = require('../controllers/crop');

/**
 * @swagger
 * 	definition:
 *   crop:
 *     properties:
 *       name:
 *         type: string
 *       description:
 *         type: string
 *       price:
 *         type: integer
 *       quantity:
 *         type: integer
 */


/**
* @swagger
* /crops:
*   get:
*     description: get the list of all the crops added by user.
*     tags: [Crops]
*     responses:
*       200:
*         description: success
*         schema:
*           type: object
*           $ref: '#/definitions/crop'
*/

router.get('/crops', authController.isAuthenticated,cropController.getCrops);

/**
* @swagger
* /crops:
*   post:
*     description: Creates a new crop
*     tags: [Crops]
*     produces:
*       - application/json
*     parameters:
*       - name: name
*         description: crop name
*         in: formData
*         required: true
*         type: string

*       - name: description
*         description: crop description
*         in: formData
*         required: true
*         type: string

*       - name: price
*         description: crop price
*         in: formData
*         required: true
*         type: integer

*       - name: quantity
*         description: crop quantity
*         in: formData
*         required: true
*         type: integer
*     responses:
*       200:
*         description: successfully created
*         schema:
*           type: object
*           $ref: '#/definitions/crop'
*/
router.post('/crops',authController.isAuthenticated, cropController.postCrops);

/**
 * @swagger
 * /crops/{crop_id}:
 *   get:
 *     tags:
 *       - Crops
 *     description: Returns a single crop
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: crop_id
 *         description: crop's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single Crop
 *         schema:
 *           $ref: '#/definitions/crop'
 */

router.get('/crops/:crop_id', authController.isAuthenticated,cropController.getCrop);


/**
 * @swagger
 * /crops/{crop_id}:
 *   put:
 *     tags:
 *       - Crops
 *     description: Deletes a single crop
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: crop_id
 *         description: crops's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully Updated
 */
router.put('/crops/:crop_id', authController.isAuthenticated, cropController.putCrop);

/**
 * @swagger
 * /crops/{crop_id}:
 *   delete:
 *     tags:
 *       - Crops
 *     description: Deletes a single crop
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: crop_id
 *         description: crops's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
router.delete('/crops/:crop_id',authController.isAuthenticated, cropController.deleteCrop);

module.exports = router;