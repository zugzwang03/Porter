const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const validator = require('validator');

const driverSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        validate: [validator.isMobilePhone, "PLease use a valid phone number"],
        required: true
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Enter valid email id"]
    },
    profilePhoto: {
        type: String
    },
    name: {
        type: String
    },
    birthDate: {
        type: Date
    },
    licenseFrontSide: {
        type: String
    },
    adharCardBackSide: {
        type: String
    }
    ,
    adharCardFrontSide: {
        type: String
    },
    licenseBackSide: {
        type: String
    },
    cheque: {
        type: String
    },
    acceptedOrders: [
        {
            tracking_id: {
                type: String
            },
            paymentReceived: {
                type: Number
            },
            volume: {
                type: String
            }
        }
    ],
    vehicle: {
        type: {
            type: String
        },
        No: {
            type: String
        },
        storageCapacity: {
            type: String
        }
    }
});

driverSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

//Generating password reset token
driverSchema.methods.getResetPasswordToken = function () {
    //Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex');
    //Hashing and adding to resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}

const Driver = mongoose.model('Driver', driverSchema);
module.exports = Driver;