import React from "react";
import { Link } from "react-router-dom";


function CustomerList({ customers }) {
  return (
    <table border="1" cellPadding="8">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c) => (
          <tr key={c.id}>
            <td>
              <Link to={`/customers/${c.id}`}>
                {c.first_name} {c.last_name}
              </Link>
            </td>
            <td>{c.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CustomerList;
