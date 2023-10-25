const isAuthenticated = require('../middlewares/auth');4
const pamController = require('../controllers/pamController.js');
const router = require('express').Router();

router.route('/login/pam').post(pamController.login);
router.route('/addEmail/pam').post(isAuthenticated, pamController.addEmail);
router.route('/accountDetails/pam').post(isAuthenticated, pamController.accountDetails);
router.route('/verifyIdentity/pam').post(isAuthenticated, pamController.verifyIdentity);
router.route('/acceptOrder/pam').post(isAuthenticated, pamController.acceptOrder);
router.route('/addSupervisor/pam').post(isAuthenticated, pamController.addSupervisor);
router.route('/editAccountDetails/pam').post(isAuthenticated, pamController.editAccountDetails);

module.exports = router;