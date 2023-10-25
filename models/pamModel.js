const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const validator = require('validator');

const pamSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        validate: [validator.isMobilePhone, "PLease use a valid phone number"],
        required: true
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Please enter valid email id"]
    },
    name: {
        type: String
    },
    birthDate: {
        type: Date
    },
    photo: {
        type: String
    },
    jobType: {
        type: String
    },
    preferredWorkLocation: {
        type: String
    },
    adharCard: {
        type: String
    },
    panCard: {
        type: String
    },
    legal_name: {
        type: String
    },
    trade_name: {
        type: String
    },
    availability: {
        type: String
    },
    acceptedOrders: [
        {
            tracking_id: {
                type: String
            },
            amount: {
                type: Number
            },
            supervisor: {
                // name (phoneNumber)
                type: String
            }
        }
    ],
});

pamSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

//Generating password reset token
pamSchema.methods.getResetPasswordToken = function () {
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

const Pam = mongoose.model('pam', pamSchema);
module.exports = Pam;