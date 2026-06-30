const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const auth = require("../middleware/auth");


// Get All Notifications

router.get("/", auth, async (req, res) => {

    const notifications = await Notification.find({
        userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
        success: true,
        notifications,
    });

});


// Get Notification by ID

router.get("/:id", auth, async (req, res) => {

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: "Notification not found",
        });
    }

    res.json({
        success: true,
        notification,
    });

});


// Create Notification

router.post("/", auth, async (req, res) => {

    const { title, message, type } = req.body;

    const notification = await Notification.create({

        userId: req.user.id,

        title,

        message,

        type,

    });

    res.status(201).json({

        success: true,

        notification,

    });

});


// Mark as Read

router.patch("/:id/read", auth, async (req, res) => {

    const notification = await Notification.findByIdAndUpdate(

        req.params.id,

        { isRead: true },

        { new: true }

    );

    res.json({

        success: true,

        notification,

    });

});


// Mark All Read

router.patch("/read/all", auth, async (req, res) => {

    await Notification.updateMany(

        { userId: req.user.id },

        { isRead: true }

    );

    res.json({

        success: true,

        message: "All notifications marked as read",

    });

});


// Delete Notification

router.delete("/:id", auth, async (req, res) => {

    await Notification.findByIdAndDelete(req.params.id);

    res.json({

        success: true,

        message: "Notification deleted",

    });

});

module.exports = router;