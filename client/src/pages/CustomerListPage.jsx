import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Toast, ToastContainer } from "react-bootstrap";

function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Selected customer
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Customer form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Address form
  const [addressDetails, setAddressDetails] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pinCode, setPinCode] = useState("");

  // Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/customers");
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) setCustomers(data);
      else if (data.data && Array.isArray(data.data)) setCustomers(data.data);
      else if (data.customers) setCustomers(data.customers);
      else setCustomers([]);
    } catch (err) {
      console.error("Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- DELETE ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/customers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete customer");
      setCustomers(customers.filter((cust) => cust.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting customer");
    }
  };

  // ---------- EDIT ----------
  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setFirstName(customer.first_name || "");
    setLastName(customer.last_name || "");
    setPhoneNumber(customer.phone_number || "");
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    if (!selectedCustomer) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/customers/${selectedCustomer.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to update customer");

      setCustomers((prev) =>
        prev.map((cust) =>
          cust.id === selectedCustomer.id
            ? { ...cust, first_name: firstName, last_name: lastName, phone_number: phoneNumber }
            : cust
        )
      );
      setShowEditModal(false);
      setSelectedCustomer(null);
    } catch (err) {
      console.error(err);
      alert("Error updating customer");
    }
  };

  // ---------- ADD CUSTOMER ----------
  const handleAdd = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/customers/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
        }),
      });
      if (!res.ok) throw new Error("Failed to add customer");
      const newCustomer = await res.json();
      setCustomers((prev) => [...prev, newCustomer]);
      setShowAddModal(false);
      setFirstName("");
      setLastName("");
      setPhoneNumber("");
    } catch (err) {
      console.error(err);
      alert("Error adding customer");
    }
  };

  // ---------- ADD ADDRESS ----------
  const handleAddAddressClick = (customer) => {
    setSelectedCustomer(customer);
    setAddressDetails("");
    setCity("");
    setState("");
    setPinCode("");
    setShowAddressModal(true);
  };

  const handleAddAddress = async () => {
    if (!selectedCustomer) {
      alert("No customer selected");
      return;
    }

    console.log("Adding address for customer:", selectedCustomer.id);
    console.log({ addressDetails, city, state, pinCode });

    try {
      const res = await fetch(
        `http://localhost:5000/api/customers/${selectedCustomer.id}/addresses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            address_details: addressDetails,
            city,
            state,
            pin_code: pinCode,
          }),
        }
      );

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorData = await res.text();
        console.error("Failed response:", errorData);
        throw new Error("Failed to add address");
      }

      setShowAddressModal(false);
      setToastMessage("Address added successfully!");
      setShowToast(true);
    } catch (err) {
      console.error("Error adding address:", err);
      alert("Error adding address");
    }
  };

  // ---------- SEARCH ----------
  const filteredCustomers = customers.filter((cust) => {
    const firstName = cust.first_name || "";
    const lastName = cust.last_name || "";
    const phone = cust.phone_number || "";

    return (
      firstName.toLowerCase().includes(search.toLowerCase()) ||
      lastName.toLowerCase().includes(search.toLowerCase()) ||
      phone.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex flex-col p-6" style={{ margin: "50px 200px" }}>
      <h1 className="text-2xl font-bold mb-4">Customer List</h1>

      <div className="flex w-full max-w-4xl justify-between mb-4">
        <input
          type="text"
          placeholder="🔍 Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-1/2 me-3"
        />
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          ➕ Add Customer
        </Button>
      </div>

      {filteredCustomers.length === 0 ? (
        <p className="mt-6">No customers found</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="table-auto border-collapse border border-gray-300 w-full text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">#</th>
                <th className="border px-4 py-2">First Name</th>
                <th className="border px-4 py-2">Last Name</th>
                <th className="border px-4 py-2">Phone</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust, index) => (
                <tr key={cust.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{cust.first_name}</td>
                  <td className="border px-4 py-2">{cust.last_name}</td>
                  <td className="border px-4 py-2">{cust.phone_number}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <Button variant="warning" className="me-2" onClick={() => handleEditClick(cust)}>
                      ✏️ Edit
                    </Button>
                    <Button variant="danger" className="me-2" onClick={() => handleDelete(cust.id)}>
                      🗑️ Delete
                    </Button>
                    <Button variant="success" onClick={() => handleAddAddressClick(cust)}>
                      🏠 Add Address
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------- Add Customer Modal ---------- */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="button" onClick={handleAdd}>
            Add Customer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------- Edit Customer Modal ---------- */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="button" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------- Add Address Modal ---------- */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Address Details</Form.Label>
              <Form.Control
                type="text"
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control type="text" value={city} onChange={(e) => setCity(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>State</Form.Label>
              <Form.Control type="text" value={state} onChange={(e) => setState(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Pin Code</Form.Label>
              <Form.Control type="text" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddressModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="button" onClick={handleAddAddress}>
            Add Address
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ---------- Toast ---------- */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default CustomerListPage;
