const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorHandler.js");
const User = require("../models/userModel.js");

const tracking = catchAsyncErrors(async (req, res, next) => {
    // phoneNumber, id, details, driver, vehicle, carpenter
    var { phoneNumber, id, details, driver, vehicle, carpenter } = req.body;
    var user = await User.findOne({ phoneNumber });
    if (!user) {
        return next(new ErrorHandler("User not logged in", "401"));
    }
    if (details) {
        for (var detail of details) {
            user = await User.findOneAndUpdate({ "_id": user._id, "tracking.id": id },
                {
                    "$push":
                    {
                        "tracking.$.details":
                            detail,
                    }
                }, { new: true });
        }
    }
    user = await User.findOneAndUpdate({ "_id": user._id, "tracking.id": id },
        {
            "tracking.$.driver": driver,
            "tracking.$carpenter": carpenter,
            "tracking.$.vehicle": vehicle
        }, { new: true });
    res.status(200).json({
        success: true,
        user
    });
});

module.exports = tracking;