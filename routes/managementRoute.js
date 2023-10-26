const isAuthenticated = require('../middlewares/auth');
const managementController = require('../controllers/managementController');
const router = require('express').Router();

router.route('/login/management').post(managementController.login);
router.route('/addEmail/management').post(isAuthenticated, managementController.addEmail);
router.route('/accountDetails/management').post(isAuthenticated, managementController.accountDetails);
router.route('/verifyIdentity/management').post(isAuthenticated, managementController.verifyIdentity);
router.route('/assignDriver/management').post(isAuthenticated, managementController.assignDriver);

module.exports = router;