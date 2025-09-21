const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const addressController = require("../controllers/addressController");

// Customer routes
router.post("/", customerController.createCustomer);
router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

// Address routes (nested under customers)
router.post("/:id/addresses", addressController.createAddress);
router.get("/:id/addresses", addressController.getAddressesByCustomer);

module.exports = router;
