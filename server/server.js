const app = require("./app.js");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");

dotenv.config({ path: "../config/config.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const connDb = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: 'JK-Bros'
    }).then(() => {
        console.log("Database connected");
    }).catch((e) => {
        console.log(e);
    })
};

connDb();

app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`);
});