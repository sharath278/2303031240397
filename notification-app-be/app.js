


const express = require("express");
const mongoose = require("mongoose");

const notificationRoute = require("./routes/notification");

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/notificationSystem')
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api/notifications", notificationRoute);

app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});