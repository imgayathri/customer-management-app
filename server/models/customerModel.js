const db = require("../database");

const Customer = {
  getAll: (callback) => {
    db.all("SELECT * FROM customers", [], callback);
  },

  getById: (id, callback) => {
    db.get("SELECT * FROM customers WHERE id = ?", [id], callback);
  },

  create: (customer, callback) => {
    const { first_name, last_name, phone_number } = customer;
    db.run(
      "INSERT INTO customers (first_name, last_name, phone_number) VALUES (?, ?, ?)",
      [first_name, last_name, phone_number],
      function (err) {
        callback(err, { id: this.lastID, ...customer });
      }
    );
  },

  update: (id, customer, callback) => {
    const { first_name, last_name, phone_number } = customer;
    db.run(
      "UPDATE customers SET first_name = ?, last_name = ?, phone_number = ? WHERE id = ?",
      [first_name, last_name, phone_number, id],
      function (err) {
        callback(err, { id, ...customer });
      }
    );
  },

  delete: (id, callback) => {
    db.run("DELETE FROM customers WHERE id = ?", [id], function (err) {
      callback(err, { deletedID: id });
    });
  },
};

module.exports = Customer;
