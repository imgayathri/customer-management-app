const Customer = require("../models/customerModel");

exports.getAllCustomers = (req, res) => {
  Customer.getAll((err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "success", data: rows });
  });
};

exports.getCustomerById = (req, res) => {
  Customer.getById(req.params.id, (err, row) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "success", data: row });
  });
};

exports.createCustomer = (req, res) => {
  Customer.create(req.body, (err, customer) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ message: "customer created", data: customer });
  });
};

exports.updateCustomer = (req, res) => {
  Customer.update(req.params.id, req.body, (err, customer) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "customer updated", data: customer });
  });
};

exports.deleteCustomer = (req, res) => {
  Customer.delete(req.params.id, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "customer deleted", data: result });
  });
};
