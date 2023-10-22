const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const app = express();
const userRoute = require('./routes/userRoute.js');
const trackingRoute = require('./routes/trackingRoute.js');
const driverRoute = require('./routes/driverRoute.js');
const pamRoute = require('./routes/pamRoute.js');
const management = require('./routes/managementRoute.js');

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());

app.use(
    cors({
        origin: process.env.FRONT_END_URL,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true,
    })
);

app.use("/api/v1", userRoute);
app.use("/api/v1", trackingRoute);
app.use("/api/v1", driverRoute);
app.use("/api/v1", pamRoute);
app.use("/api/v1", management);

module.exports = app;