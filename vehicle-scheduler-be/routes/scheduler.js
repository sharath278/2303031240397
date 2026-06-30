const express = require("express");

const router = express.Router();

const generateSchedule = require("../services/schedulerService");

router.get("/", async (req, res) => {

    try {

        const data = await generateSchedule();

        res.json(data);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;