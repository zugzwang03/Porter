const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorHandler.js");
const sendCookie = require("../utils/sendCookie.js");
const Driver = require("../models/driverModel.js");
const cloudinary = require('cloudinary');

const login = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber
    var { phoneNumber } = req.body;
    var driver = await Driver.findOne({ phoneNumber });
    if (driver) {
        return next(new ErrorHandler("Another account with same phone number already exists", '401'));
    }
    driver = await Driver.create({ phoneNumber });
    sendCookie(driver, 201, res);
});

const addEmail = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, email
    var { phoneNumber, email } = req.body;
    var driver = await Driver.findOne({ phoneNumber });
    if (!driver) {
        return next(new ErrorHandler("Driver not logged in yet", '401'));
    }
    driver = await Driver.findByIdAndUpdate(driver._id, { email }, { new: true });
    res.status(200).json({
        driver,
        success: true
    });
});

const accountDetails = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, profilePhoto, name, birthDate
    var { phoneNumber, name, birthDate } = req.body;
    var driver = await Driver.findOne({ phoneNumber });
    if (!driver) {
        return next(new ErrorHandler("Driver not logged in yet", "401"));
    }
    console.log(driver);
    driver = await Driver.findByIdAndUpdate(driver._id, { name, birthDate }, { new: true });
    var photo = req.files.photo;
    cloudinary.v2.uploader.upload_stream({ folder: "Porter", resource_type: 'auto' }, async (error, result) => {
        if (error) {
            console.log(error);
            return next(new ErrorHandler('Some error occurred!', '500'));
        } else {
            driver = await Driver.findByIdAndUpdate(driver._id, { profilePhoto: result.secure_url },
                { new: true });
        }
    }).end(photo.data);
    res.status(200).json({
        driver,
        success: true
    });
});

const verifyIdentity = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, adharCardFrontSide, adharCardBackSide, licenseFrontSide, licenseBackSide, cheque
    var { phoneNumber } = req.body;
    var driver = await Driver.findOne({ phoneNumber });
    if (!driver) {
        return next(new ErrorHandler("Driver not logged in yet", "401"));
    }
    var files = req.files;
    if (files.adharCardFrontSide) {
        cloudinary.v2.uploader.upload_stream({ folder: "Porter", resource_type: 'auto' }, async (error, result) => {
            if (error) {
                console.log(error);
                return next(new ErrorHandler('Some error occurred!', '500'));
            } else {
                driver = await Driver.findByIdAndUpdate(driver._id, { adharCardFrontSide: result.secure_url },
                    { new: true });
                console.log(driver);
            }
        }).end(files.adharCardFrontSide.data);
    }
    if (files.adharCardBackSide) {
        cloudinary.v2.uploader.upload_stream({ folder: "Porter", resource_type: 'auto' }, async (error, result) => {
            if (error) {
                console.log(error);
                return next(new ErrorHandler('Some error occurred!', '500'));
            } else {
                driver = await Driver.findByIdAndUpdate(driver._id, { adharCardBackSide: result.secure_url },
                    { new: true });
                console.log(driver);
            }
        }).end(files.adharCardBackSide.data);
    }
    if (files.licenseFrontSide) {
        cloudinary.v2.uploader.upload_stream({ folder: "Porter", resource_type: 'auto' }, async (error, result) => {
            if (error) {
                console.log(error);
                return next(new ErrorHandler('Some error occurred!', '500'));
            } else {
                driver = await Driver.findByIdAndUpdate(driver._id, { licenseFrontSide: result.secure_url },
                    { new: true });
                console.log(driver);
            }
        }).end(files.licenseFrontSide.data);
    }
    if (files.licenseBackSide) {
        cloudinary.v2.uploader.upload_stream({ folder: "Porter", resource_type: 'auto' }, async (error, result) => {
            if (error) {
                console.log(error);
                return next(new ErrorHandler('Some error occurred!', '500'));
            } else {
                driver = await Driver.findByIdAndUpdate(driver._id, { licenseBackSide: result.secure_url },
                    { new: true });
                console.log(driver);
            }
        }).end(files.licenseBackSide.data);
    }
    if (files.cheque) {
        cloudinary.v2.uploader.upload_stream({ folder: "Porter", resource_type: 'auto' }, async (error, result) => {
            if (error) {
                console.log(error);
                return next(new ErrorHandler('Some error occurred!', '500'));
            } else {
                driver = await Driver.findByIdAndUpdate(driver._id, { cheque: result.secure_url },
                    { new: true });
            }
        }).end(files.cheque.data);
    }
    res.status(200).json({
        driver,
        success: true
    });
});

const acceptOrder = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, tracking_id, paymentReceived, volume
    var { phoneNumber, tracking_id, paymentReceived, volume } = req.body;
    var driver = await Driver.findOne({ phoneNumber });
    if (!driver) {
        return next(new ErrorHandler("Driver not logged in yet", "401"));
    }
    driver = await Driver.findByIdAndUpdate(driver._id, { $push: { acceptedOrders: { tracking_id, paymentReceived, volume } } }, {new: true});
    res.status(200).json({
        driver,
        success: true
    });
});

const vehicle = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, type, No, storageCapacity
    var {phoneNumber, type, No, storageCapacity} = req.body;
    var driver = await Driver.findOne({ phoneNumber });
    if (!driver) {
        return next(new ErrorHandler("Driver not logged in yet", "401"));
    }
    driver = await Driver.findByIdAndUpdate(driver._id, {vehicle: {type, No, storageCapacity}}, {new: true});
    res.status(200).json({
        driver,
        success: true
    });
});

const check = catchAsyncErrors(async (req, res, next) => {
    console.log("hello");
    res.status(200).json({
        success: true
    });
})

module.exports = { login, accountDetails, verifyIdentity, acceptOrder, vehicle, addEmail, check };