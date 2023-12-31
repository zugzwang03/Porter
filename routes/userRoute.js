const router = require('express').Router();
const userController = require('../controllers/userController.js');
const isAuthenticated = require("../middlewares/auth.js");

router.route('/login/user').post(userController.login);
router.route('/accountDetails/user').post(isAuthenticated, userController.accountDetails);
router.route('/storage/user').post(isAuthenticated, userController.storage);
router.route('/packersAndMovers/user').post(isAuthenticated, userController.packersAndMovers);

module.exports = router;