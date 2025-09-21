import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/customers/${id}`)
      .then((res) => setCustomer(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/customers/${id}`);
      navigate("/");
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  };

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">
        {customer.first_name} {customer.last_name}
      </h2>
      <p className="mb-2">📞 {customer.phone_number}</p>

      <h3 className="text-lg font-semibold mt-4">Addresses</h3>
      <ul className="list-disc pl-6">
        {customer.addresses && customer.addresses.length > 0 ? (
          customer.addresses.map((a) => (
            <li key={a.id}>
              {a.address_details}, {a.city}, {a.state}, {a.pin_code}
            </li>
          ))
        ) : (
          <p>No addresses available</p>
        )}
      </ul>

      <div className="mt-6 flex gap-4">
        <Link
          to={`/customers/${id}/edit`}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ✏️ Edit
        </Link>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          🗑 Delete
        </button>
      </div>
    </div>
  );
}

export default CustomerDetailPage;
