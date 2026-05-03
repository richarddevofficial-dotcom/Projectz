const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

// Cart is managed on frontend with localStorage
// These endpoints are for syncing cart to database (optional)
router.get("/", protect, async (req, res) => {
  res.json({ message: "Cart endpoint - implement as needed" });
});

module.exports = router;
