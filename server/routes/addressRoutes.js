const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

// Independent address routes
router.put("/:addressId", addressController.updateAddress);
router.delete("/:addressId", addressController.deleteAddress);

module.exports = router;
