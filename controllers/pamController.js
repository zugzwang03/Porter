const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorHandler.js");
const sendCookie = require("../utils/sendCookie.js");
const Pam = require("../models/pamModel.js");
const cloudinary = require('cloudinary');

const login = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber
    var { phoneNumber } = req.body;
    var pam = await Pam.findOne({ phoneNumber });
    if (pam) {
        return next(new ErrorHandler("Another account with same phone number already exists", '401'));
    }
    pam = await Pam.create({ phoneNumber });
    sendCookie(pam, 201, res);
});

const addEmail = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, email
    var { phoneNumber, email } = req.body;
    var pam = await Pam.findOne({ phoneNumber });
    if (!pam) {
        return next(new ErrorHandler("Pam not logged in yet", "401"));
    }
    pam = await Pam.findByIdAndUpdate(pam._id, { email }, { new: true });
    res.status(200).json({
        success: true,
        pam
    });
});

const accountDetails = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, name, birthDate, photo, jobType, preferredJobLocation
    var { phoneNumber, name, birthDate, jobType, preferredJobLocation } = req.body;
    var pam = await Pam.findOne({ phoneNumber });
    if (!pam) {
        return next(new ErrorHandler("Pam not logged in yet", "401"));
    }
    pam = await Pam.findByIdAndUpdate(pam._id, { name, birthDate, jobType, preferredJobLocation }, { new: true });
    cloudinary.v2.uploader.upload_stream({ folder: "Porter", resource_type: "auto" }, async (error, result) => {
        if (error) {
            console.log(error);
            return next(new ErrorHandler('Some error occurred!', '500'));
        } else {
            pam = await Pam.findByIdAndUpdate(pam._id, { photo: result.secure_url },
                { new: true });
        }
    }).end(req.files.photo.data);
    res.status(200).json({
        success: true,
        pam
    });
});

const verifyIdentity = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, adharCard, panCard
    var { phoneNumber } = req.body;
    var pam = await Pam.findOne({ phoneNumber });
    if (!pam) {
        return next(new ErrorHandler("Pam not logged in yet", "401"));
    }
    cloudinary.v2.uploader.upload_stream({ folder: "Porter", resource_type: "auto" }, async (error, result) => {
        if (error) {
            console.log(error);
            return next(new ErrorHandler('Some error occurred!', '500'));
        } else {
            pam = await Pam.findByIdAndUpdate(pam._id, { adharCard: result.secure_url },
                { new: true });
        }
    }).end(req.files.adharCard.data);
    cloudinary.v2.uploader.upload_stream({ folder: "Porter", resource_type: "auto" }, async (error, result) => {
        if (error) {
            console.log(error);
            return next(new ErrorHandler('Some error occurred!', '500'));
        } else {
            pam = await Pam.findByIdAndUpdate(pam._id, { panCard: result.secure_url },
                { new: true });
        }
    }).end(req.files.panCard.data);
    res.status(200).json({
        success: true,
        pam
    });
});

const acceptOrder = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, tracking_id, amount
    var { phoneNumber, tracking_id, amount } = req.body;
    var pam = await Pam.findOne({ phoneNumber });
    if (!pam) {
        return next(new ErrorHandler("Driver not logged in yet", "401"));
    }
    pam = await Pam.findByIdAndUpdate(pam._id, { $push: { acceptedOrders: { tracking_id, amount } } }, { new: true });
    res.status(200).json({
        pam,
        success: true
    });
});

const addSupervisor = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, tracking_id, supervisor
    var { phoneNumber, tracking_id, supervisor } = req.body;
    var pam = await Pam.findOne({ phoneNumber });
    if (!pam) {
        return next(new ErrorHandler("Driver not logged in yet", "401"));
    }
    pam = await Pam.findOneAndUpdate(
        { _id: pam._id, "acceptedOrders.tracking_id": tracking_id },
        {
            "acceptedOrders.$.supervisor": supervisor,
        },
        { new: true }
    );
    res.status(200).json({
        pam,
        success: true
    });
});

const editAccountDetails = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, name, legal_name, trade_name, availability, photo
    var { phoneNumber, name, legal_name, trade_name, availability } = req.body;
    var pam = await Pam.findOne({ phoneNumber });
    if (!pam) {
        return next(new ErrorHandler("Pam not logged in yet", "401"));
    }
    pam = await Pam.findByIdAndUpdate(pam._id, { name, legal_name, trade_name, availability }, { new: true });
    cloudinary.v2.uploader.upload_stream({ folder: "Porter", resource_type: "auto" }, async (error, result) => {
        if (error) {
            console.log(error);
            return next(new ErrorHandler('Some error occurred!', '500'));
        } else {
            pam = await Pam.findByIdAndUpdate(pam._id, { photo: result.secure_url },
                { new: true });
        }
    }).end(req.files.photo.data);
    res.status(200).json({
        success: true,
        pam
    });
})

module.exports = { login, addEmail, accountDetails, verifyIdentity, acceptOrder, addSupervisor, editAccountDetails };