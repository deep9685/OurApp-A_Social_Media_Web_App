const express = require("express");
const router = express.Router();

const User = require("../models/User");

// search user routes
router.get("/", async (req, res) => {
    console.log("I am in search route.");
  try {
    const query = req.query.query;
    const currentUserId = req.user._id;


    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    // search for user whose usernamecontains the query string
    const users = await User.find({ userName: new RegExp(query, "i"), _id:{ $ne: currentUserId} });

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
