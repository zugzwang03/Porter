const User = require("../models/userModel.js");
const ErrorHandler = require("../utils/errorHandler.js");
const catchAsyncErrors = require("./catchAsyncErrors.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Driver = require("../models/driverModel.js");
const Pam = require("../models/pamModel.js");
const Management = require("../models/managementModel.js");

dotenv.config({ path: ".././config/config.env" });

const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    if (req.headers.person == 'user')
        req.user = await User.findById(decodedData.id);
    else if(req.headers.person == 'driver')
        req.user = await Driver.findById(decodedData.id);
    else if(req.headers.person == 'pam')
        req.user = await Pam.findById(decodedData.id);
    else 
        req.user = await Management.findById(decodedData.id);
    next();
});

module.exports = isAuthenticated;