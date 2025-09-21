import React from "react";

function AddressList({ addresses }) {
  

  return (
    <ul>
      {addresses.map((addr) => (
        <li key={addr.id}>
          {addr.street}, {addr.city}, {addr.state}, {addr.zip}
        </li>
      ))}
    </ul>
  );
}

export default AddressList;
