const express = require("express");
const schedulerRoute = require("./routes/scheduler");

const app = express();

app.use(express.json());

app.use("/schedule", schedulerRoute);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});