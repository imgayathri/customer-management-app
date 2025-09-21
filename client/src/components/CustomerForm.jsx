import React from "react";


function CustomerForm({ formData, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>First Name:</label>
        <input
          name="first_name"
          value={formData.first_name}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label>Last Name:</label>
        <input
          name="last_name"
          value={formData.last_name}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <label>Phone Number:</label>
        <input
          name="phone_number"
          type="tel"
          value={formData.phone_number}
          onChange={onChange}
          required
        />
      </div>
      <button type="submit">Save</button>
    </form>
  );
}

export default CustomerForm;
