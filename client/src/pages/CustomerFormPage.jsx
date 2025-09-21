import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CustomerFormPage() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    address_details: "",
    city: "",
    state: "",
    pin_code: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key in formData) {
      if (!formData[key]) {
        setMessage(`⚠️ ${key.replace("_", " ")} is required`);
        return;
      }
    }

    try {
      const res = await axios.post("http://localhost:5000/api/customers", formData);
      setMessage("✅ Customer added successfully!");
      setTimeout(() => navigate(`/customers/${res.data.id}`), 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error adding customer");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Customer</h2>
      {message && <p className="mb-4 text-center">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        {Object.keys(formData).map((field) => (
          <input
            key={field}
            name={field}
            placeholder={field.replace("_", " ")}
            value={formData[field]}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        ))}
        <button className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700">
          Save Customer
        </button>
      </form>
    </div>
  );
}

export default CustomerFormPage;
