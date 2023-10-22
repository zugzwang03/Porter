const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const validator = require('validator');

const managementSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        validate: [validator.isMobilePhone, "PLease use a valid phone number"],
        required: true
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    name: {
        type: String
    },
    birthDate: {
        type: Date
    },
    location: {
        type: String
    },
    photo: {
        type: String
    },
    adharCard: {
        type: String
    },
    panCard: {
        type: String
    }
});

managementSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

//Generating password reset token
managementSchema.methods.getResetPasswordToken = function () {
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

const management = mongoose.model('Management', managementSchema);
module.exports = management;