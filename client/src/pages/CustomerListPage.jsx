import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CustomerListPage() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetch("http://localhost:5000/api/customers")
            .then((res) => {
                if (!res.ok) throw new Error(`Error: ${res.status}`);
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setCustomers(data);
                } else if (data.data && Array.isArray(data.data)) {
                    // ✅ your API format
                    setCustomers(data.data);
                } else if (data.customers) {
                    setCustomers(data.customers);
                } else {
                    setCustomers([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching customers:", err);
                setLoading(false);
            });
    }, []);


    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Customer List</h1>
            <Link
                to="/customers/new"
                className="mb-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                ➕ Add New Customer
            </Link>
            {customers.length === 0 ? (
                <p>No customers found</p>
            ) : (
                <ul className="space-y-2">
                    {customers.map((cust) => (
                        <li
                            key={cust.id}
                            className="p-4 border rounded-lg shadow-sm hover:shadow-md"
                        >
                            <p className="font-semibold">
                                {cust.first_name} {cust.last_name}
                            </p>
                            <p>📞 {cust.phone_number}</p>
                            <Link
                                to={`/customers/${cust.id}`}
                                className="text-blue-600 hover:underline"
                            >
                                View Details →
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default CustomerListPage;
