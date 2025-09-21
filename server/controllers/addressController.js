const Address = require("../models/addressModal");

exports.getAddressesByCustomer = (req, res) => {
  Address.getByCustomerId(req.params.id, (err, rows) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "success", data: rows });
  });
};

exports.createAddress = (req, res) => {
  Address.create(req.params.id, req.body, (err, address) => {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ message: "address created", data: address });
  });
};

exports.updateAddress = (req, res) => {
  Address.update(req.params.addressId, req.body, (err, address) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "address updated", data: address });
  });
};

exports.deleteAddress = (req, res) => {
  Address.delete(req.params.addressId, (err, result) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: "address deleted", data: result });
  });
};
