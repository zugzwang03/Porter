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
    // phoneNumber, storageType, pickUpLocation, dropLocation, floorNo, hasServiceLiftPickUpLocation, hasServiceLiftDropLocation, movingOn, collectionOfItems, collectionOfVehicles, totalCost
    var { phoneNumber, storageType, pickUpLocation, dropLocation, floorNo, hasServiceLiftPickUpLocation, hasServiceLiftDropLocation, movingOn, collectionOfItems, collectionOfVehicles } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler("User not logged in yet", "401"));
    }
    user = await User.findByIdAndUpdate(user._id, { storage: { storageType, pickUpLocation, dropLocation, floorNo, hasServiceLiftPickUpLocation, hasServiceLiftDropLocation, movingOn, totalCost, shiftingDate } }, { new: true });
    for (const item of collectionOfItems) {
        user = await User.findByIdAndUpdate(user._id, { $push: { "storage.items": { itemName: item.itemName, itemDescription: item.itemDescription, quantity: item.quantity } } }, { new: true });
    }
    for (const vehicle of collectionOfVehicles) {
        user = await User.findByIdAndUpdate(user._id, { $push: { "storage.vehicles": { vehicleName: vehicle.vehicleName, vehicleDescription: vehicle.vehicleDescription, quantity: vehicle.quantity } } }, { new: true });
    }
    res.status(200).json({
        success: true,
        user
    });
});

module.exports = { login, accountDetails, storage };