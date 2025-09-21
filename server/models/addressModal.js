const db = require("../database");

const Address = {
  getByCustomerId: (customerId, callback) => {
    db.all("SELECT * FROM addresses WHERE customer_id = ?", [customerId], callback);
  },

  create: (customerId, address, callback) => {
    const { address_details, city, state, pin_code } = address;
    db.run(
      "INSERT INTO addresses (customer_id, address_details, city, state, pin_code) VALUES (?, ?, ?, ?, ?)",
      [customerId, address_details, city, state, pin_code],
      function (err) {
        callback(err, { id: this.lastID, customer_id: customerId, ...address });
      }
    );
  },

  update: (id, address, callback) => {
    const { address_details, city, state, pin_code } = address;
    db.run(
      "UPDATE addresses SET address_details = ?, city = ?, state = ?, pin_code = ? WHERE id = ?",
      [address_details, city, state, pin_code, id],
      function (err) {
        callback(err, { id, ...address });
      }
    );
  },

  delete: (id, callback) => {
    db.run("DELETE FROM addresses WHERE id = ?", [id], function (err) {
      callback(err, { deletedID: id });
    });
  },
};

module.exports = Address;
