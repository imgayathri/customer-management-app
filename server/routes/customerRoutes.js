// File: routes/customerRoutes.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const db = require("../database"); // Your SQLite database

// ------------------ New route: Customers with multiple addresses ------------------
// Place this **above** `/:id` to avoid conflicts
router.get("/multiple-addresses", (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : "%";
  const sql = `
    SELECT c.id AS customer_id, c.first_name, c.last_name,
           a.id AS address_id, a.address_details, a.city, a.state, a.pin_code
    FROM customers c
    JOIN addresses a ON c.id = a.customer_id
    WHERE c.first_name LIKE ? OR c.last_name LIKE ?
    ORDER BY c.id
  `;
  db.all(sql, [search, search], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    // Group addresses by customer
    const grouped = rows.reduce((acc, row) => {
      if (!acc[row.customer_id]) {
        acc[row.customer_id] = {
          customer_id: row.customer_id,
          first_name: row.first_name,
          last_name: row.last_name,
          addresses: [],
        };
      }
      acc[row.customer_id].addresses.push({
        address_id: row.address_id,
        address_details: row.address_details,
        city: row.city,
        state: row.state,
        pin_code: row.pin_code,
      });
      return acc;
    }, {});

    // Only include customers with more than 1 address
    const result = Object.values(grouped).filter(c => c.addresses.length > 1);

    res.json({ message: "success", data: result });
  });
});

// ------------------ Customer routes ------------------
router.post("/", customerController.createCustomer);
router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

// ------------------ Address routes (nested under customers) ------------------
const addressController = require("../controllers/addressController");
router.post("/:id/addresses", addressController.createAddress);
router.get("/:id/addresses", addressController.getAddressesByCustomer);

module.exports = router;
