const catchAsyncErrors = require("../middlewares/catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorHandler.js");
const User = require("../models/userModel.js");
const Driver = require("../models/driverModel.js");
const cloudinary = require("cloudinary");

const tracking = catchAsyncErrors(async (req, res, next) => {
  // phoneNumber, id, details, driver_id, vehicle, carpenter, photo
  var { phoneNumber, id, details, driver_id, vehicle, carpenter } = req.body;
  var user = await User.findOne({ phoneNumber });
  var driver = await Driver.findById(driver_id);
  var photo = req.files.photo;
  if (!user) {
    return next(new ErrorHandler("User not logged in", "401"));
  }
  if (photo) {
    cloudinary.v2.uploader
      .upload_stream(
        { folder: "Porter", resource_type: "auto" },
        async (error, result) => {
          if (error) {
            console.log(error);
            return next(new ErrorHandler("Some error occurred!", "500"));
          } else {
            user = await User.findOneAndUpdate(
              { _id: user._id, "tracking.id": id },
              {
                $push: {
                  "tracking.$.photo": result.secure_url,
                },
              },
              { new: true }
            );
          }
        }
      )
      .end(photo.data);
  }
  if (details) {
    for (var detail of details) {
      user = await User.findOneAndUpdate(
        { _id: user._id, "tracking.id": id },
        {
          $push: {
            "tracking.$.details": detail,
          },
        },
        { new: true }
      );
    }
  }
  user = await User.findOneAndUpdate(
    { _id: user._id, "tracking.id": id },
    {
      "tracking.$.driver": {
        name: driver.name,
        phoneNumber: driver.phoneNumber,
      },
      "tracking.$.carpenter": carpenter,
      "tracking.$.vehicle": vehicle,
    },
    { new: true }
  );
  res.status(200).json({
    success: true,
    user,
  });
});

module.exports = tracking;
