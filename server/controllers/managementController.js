const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorHandler.js");
const sendCookie = require("../utils/sendCookie.js");
const Management = require("../models/managementModel.js");
const cloudinary = require('cloudinary');

const login = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber
    var { phoneNumber } = req.body;
    var management = await Management.findOne({ phoneNumber });
    if (management) {
        return next(new ErrorHandler("Another account with same phone number already exists", '401'));
    }
    management = await Management.create({ phoneNumber });
    sendCookie(management, 201, res);
});

const addEmail = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, email
    var { phoneNumber, email } = req.body;
    var management = await Management.findOne({ phoneNumber });
    if (!management) {
        return next(new ErrorHandler("Another account with same phone number already exists", '401'));
    }
    management = await Management.findByIdAndUpdate(management._id, { email }, { new: true });
    res.status(200).json({
        success: true,
        management
    });
});

const accountDetails = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, name, birthDate, location, photo
    var { phoneNumber, name, birthDate, location } = req.body;
    var management = await Management.findOne({ phoneNumber });
    if (!management) {
        return next(new ErrorHandler("Another account with same phone number already exists", '401'));
    }
    management = await Management.findByIdAndUpdate(management._id, { name, birthDate, location }, { new: true });
    cloudinary.v2.uploader.upload_stream({ resource_type: "auto", folder: "Porter" }, async (error, result) => {
        if (error) {
            console.log(error);
            return next(new ErrorHandler('Issue in uploading', '500'));
        }
        else {
            management = await Management.findByIdAndUpdate(management._id, { photo: result.secure_url }, { new: true });
        }
    }).end(req.files.photo.data);
    res.status(200).json({
        management,
        success: true
    });
});

const verifyIdentity = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, adharCard, panCard
    var { phoneNumber} = req.body;
    var management = await Management.findOne({ phoneNumber });
    if (!management) {
        return next(new ErrorHandler("Another account with same phone number already exists", '401'));
    }
    cloudinary.v2.uploader.upload_stream({ resource_type: "auto", folder: "Porter" }, async (error, result) => {
        if (error) {
            console.log(error);
            return next(new ErrorHandler('Issue in uploading', '500'));
        }
        else {
            management = await Management.findByIdAndUpdate(management._id, {adharCard: result.secure_url}, {new: true});
        }
    }).end(req.files.adharCard.data);
    cloudinary.v2.uploader.upload_stream({ resource_type: "auto", folder: "Porter" }, async (error, result) => {
        if (error) {
            console.log(error);
            return next(new ErrorHandler('Issue in uploading', '500'));
        }
        else {
            management = await Management.findByIdAndUpdate(management._id, {panCard: result.secure_url}, {new: true});
        }
    }).end(req.files.panCard.data);
    res.status(200).json({
        management,
        success: true
    });
})

module.exports = { login, addEmail, accountDetails, verifyIdentity };