const isAuthenticated = require('../middlewares/auth');4
const driverController = require('../controllers/driverController.js');
const router = require('express').Router();

router.route('/login/driver').post(driverController.login);
router.route('/addEmail/driver').post(isAuthenticated, driverController.addEmail);
router.route('/accountDetails/driver').post(isAuthenticated, driverController.accountDetails);
router.route('/vehicle/driver').post(isAuthenticated, driverController.vehicle);
router.route('/verify/driver').post(isAuthenticated, driverController.verifyIdentity);
router.route('/acceptOrder/driver').post(isAuthenticated, driverController.acceptOrder);
router.route('/check').get(driverController.check);

module.exports = router;