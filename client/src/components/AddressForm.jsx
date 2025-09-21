import { useState } from "react";
import axios from "axios";
import BaseUrl from "../services/api";

function AddressForm({ customerId }) {
  const [formData, setFormData] = useState({
    address_details: "",
    city: "",
    state: "",
    pin_code: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BaseUrl}/api/customers/${customerId}/addresses`,
        formData
      );

      alert("Address added!");

      // ✅ Reset form fields
      setFormData({
        address_details: "",
        city: "",
        state: "",
        pin_code: "",
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="address_details"
        placeholder="Address"
        value={formData.address_details}
        onChange={handleChange}
        required
      />
      <input
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        required
      />
      <input
        name="state"
        placeholder="State"
        value={formData.state}
        onChange={handleChange}
        required
      />
      <input
        name="pin_code"
        placeholder="Pin Code"
        value={formData.pin_code}
        onChange={handleChange}
        required
      />
      <button type="submit">Save Address</button>
    </form>
  );
}

export default AddressForm;
