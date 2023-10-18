const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorHandler.js");
const sendCookie = require("../utils/sendCookie.js");
const User = require("../models/userModel.js");

const login = catchAsyncErrors(async (req, res, next) => {
    var { phoneNumber } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (user) {
        return next(new ErrorHandler("Another account with same phone number already exists", '401'));
    }
    user = await User.create({ phoneNumber });
    sendCookie(user, 201, res);
});

const accountDetails = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, name, email, birthDate, purpose
    var { phoneNumber } = req.body;
    var user = await User.findOne({phoneNumber});
    if(!user) {
        return next(new ErrorHandler("User not logged in yet", "401"));
    }
    user = await User.findByIdAndUpdate(user._id, req.body, {new: true});
    res.status(200).json({
        success: true,
        user
    });
});

module.exports = { login, accountDetails };