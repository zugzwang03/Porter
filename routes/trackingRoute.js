const router = require('express').Router();
const trackingController = require('../controllers/trackingController.js');
const isAuthenticated = require("../middlewares/auth.js");

router.route('/tracking').post(isAuthenticated, trackingController);

module.exports = router;