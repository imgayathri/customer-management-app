import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function CustomerEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/customers/${id}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/customers/${id}`, formData);
      setMessage("✅ Customer updated!");
      setTimeout(() => navigate(`/customers/${id}`), 1000);
    } catch {
      setMessage("❌ Error updating customer");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Customer</h2>
      {message && <p className="mb-2">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="phone_number"
          value={formData.phone_number}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
          Update
        </button>
      </form>
    </div>
  );
}

export default CustomerEditPage;
