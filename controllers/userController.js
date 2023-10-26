const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorHandler.js");
const sendCookie = require("../utils/sendCookie.js");
const User = require("../models/userModel.js");

const login = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber
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
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler("User not logged in yet", "401"));
    }
    user = await User.findByIdAndUpdate(user._id, req.body, { new: true });
    res.status(200).json({
        success: true,
        user
    });
});

const storage = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, storageType, pickUpLocation, dropLocation, floorNo, hasServiceLiftPickUpLocation, hasServiceLiftDropLocation, movingOn, collectionOfItems, collectionOfVehicles, totalCost, shiftingDate
    var { phoneNumber, storageType, pickUpLocation, dropLocation, floorNo, hasServiceLiftPickUpLocation, hasServiceLiftDropLocation, movingOn, collectionOfItems, collectionOfVehicles, totalCost, shiftingDate } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler("User not logged in yet", "401"));
    }
    var track_id = user.tracking.length;
    user = await User.findByIdAndUpdate(user._id, { $push: { storage: { tracking_id: track_id, storageType, pickUpLocation, dropLocation, floorNo, hasServiceLiftPickUpLocation, hasServiceLiftDropLocation, movingOn, totalCost, shiftingDate } } }, { new: true });
    user = await User.findByIdAndUpdate(user._id, { $push: { tracking: { id: track_id } } }, { new: true });
    if (collectionOfItems) {
        for (const item of collectionOfItems) {
            user = await User.findByIdAndUpdate(user._id, { $push: { "storage.items": { itemName: item.itemName, itemDescription: item.itemDescription, quantity: item.quantity } } }, { new: true });
        }
    }
    if (collectionOfVehicles) {
        for (const vehicle of collectionOfVehicles) {
            user = await User.findByIdAndUpdate(user._id, { $push: { "storage.vehicles": { vehicleName: vehicle.vehicleName, vehicleDescription: vehicle.vehicleDescription, quantity: vehicle.quantity } } }, { new: true });
        }
    }
    res.status(200).json({
        success: true,
        user
    });
});

const packersAndMovers = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, pickUpLocation, dropLocation, floorNo, hasServiceLiftPickUpLocation, hasServiceLiftDropLocation, movingOn, collectionOfItems, collectionOfVehicles, totalCost, shiftingDate
    var { phoneNumber, pickUpLocation, dropLocation, floorNo, hasServiceLiftPickUpLocation, hasServiceLiftDropLocation, movingOn, collectionOfItems, collectionOfVehicles, totalCost, shiftingDate } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler("User not logged in yet", "401"));
    }
    var track_id = user.tracking.length;
    user = await User.findByIdAndUpdate(user._id, { $push: { packersAndMovers: { tracking_id: track_id, pickUpLocation, dropLocation, floorNo, hasServiceLiftPickUpLocation, hasServiceLiftDropLocation, movingOn, totalCost, shiftingDate } } }, { new: true });
    user = await User.findByIdAndUpdate(user._id, { $push: { tracking: { id: track_id } } }, { new: true });
    if (collectionOfItems) {
        for (const item of collectionOfItems) {
            user = await User.findByIdAndUpdate(user._id, { $push: { "packersAndMovers.items": { itemName: item.itemName, itemDescription: item.itemDescription, quantity: item.quantity } } }, { new: true });
        }
    }
    if (collectionOfVehicles) {
        for (const vehicle of collectionOfVehicles) {
            user = await User.findByIdAndUpdate(user._id, { $push: { "packersAndMovers.vehicles": { vehicleName: vehicle.vehicleName, vehicleDescription: vehicle.vehicleDescription, quantity: vehicle.quantity } } }, { new: true });
        }
    }
    res.status(200).json({
        success: true,
        user
    });
});

module.exports = { login, accountDetails, storage, packersAndMovers };