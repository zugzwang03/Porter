const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");

function is_Valid_Mobile_Number(mobile_number) {
    let regex = new RegExp(/(0|91)?[6-9][0-9]{9}/);
    if(mobile_number == null) {
        return false;
    }
    else if(regex.test(mobile_number) == true) {
        return true;
    }
    return false;
}

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        // validate: [is_Valid_Mobile_Number, "Enter valid phone number!"],
        validate: [validator.isMobilePhone, "Enter valid phone number!"],
        required: true
    },
    name: {
        type: String
    },
    email: {
        type: String,
        validate: [validator.isEmail, "Enter valid email address!"],
    },
    birthDate: {
        type: Date
    },
    purpose: {
        type: String
    }
});

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

//Generating password reset token
userSchema.methods.getResetPasswordToken = function () {
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

const User = mongoose.model("User", userSchema);
module.exports = User;