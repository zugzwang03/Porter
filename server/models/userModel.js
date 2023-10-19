const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
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
    },
    storage: [{
        tracking_id: {
            type: Number
        },
        storageType: {
            type: String,
        },
        pickUpLocation: {
            type: String
        },
        dropLocation: {
            type: String
        },
        floorNo: {
            type: Number
        },
        hasServiceLiftPickUpLocation: {
            type: String
        },
        hasServiceLiftDropLocation: {
            type: String
        },
        movingOn: {
            type: Date
        },
        items: [{
            itemName: {
                type: String
            },
            itemDescription: {
                type: String
            },
            quantity: {
                type: Number
            }
        }],
        vehicles: [{
            vehicleName: {
                type: String
            },
            vehicleDescription: {
                type: String
            },
            quantity: {
                type: Number
            }
        }],
        totalCost: {
            type: Number
        },
        shiftingDate: {
            type: Date
        }
    }],
    packersAndMovers: [{
        tracking_id: {
            type: Number
        },
        pickUpLocation: {
            type: String
        },
        dropLocation: {
            type: String
        },
        floorNo: {
            type: Number
        },
        hasServiceLiftPickUpLocation: {
            type: String
        },
        hasServiceLiftDropLocation: {
            type: String
        },
        movingOn: {
            type: Date
        },
        items: [{
            itemName: {
                type: String
            },
            itemDescription: {
                type: String
            },
            quantity: {
                type: Number
            }
        }],
        vehicles: [{
            vehicleName: {
                type: String
            },
            vehicleDescription: {
                type: String
            },
            quantity: {
                type: Number
            }
        }],
        totalCost: {
            type: Number
        },
        shiftingDate: {
            type: Date
        }
    }],
    tracking: [{
        storageOrPackers: {
            type: String
        },
        id: {
            type: Number
        },
        details: [
            { type: String }
        ],
        driver: {
            name: {
                type: String
            },
            phoneNumber: {
                type: String,
                validate: [validator.isMobilePhone, "Enter valid phone number!"],
            }
        },
        vehicle: {
            name: {
                type: String
            },
            description: {
                type: String
            }
        },
        carpenter: {
            name: {
                type: String
            },
            phoneNumber: {
                type: String,
                validate: [validator.isMobilePhone, "Enter valid phone number!"],
            }
        },
    }]
});

userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
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