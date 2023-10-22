const isAuthenticated = require('../middlewares/auth');4
const managementController = require('../controllers/managementController');
const router = require('express').Router();

router.route('/login/management').post(managementController.login);
router.route('/addEmail/management').post(isAuthenticated, managementController.addEmail);
router.route('/accountDetails/management').post(isAuthenticated, managementController.accountDetails);
router.route('/verifyIdentity/management').post(isAuthenticated, managementController.verifyIdentity);

module.exports = router;