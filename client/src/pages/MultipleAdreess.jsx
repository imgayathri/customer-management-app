import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ITEMS_PER_PAGE = 5;

function MultipleAddressesPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", city: "", state: "", pin_code: "" });
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async (appliedFilters = {}) => {
    setLoading(true);
    try {
      const query = [];
      if (appliedFilters.search) query.push(`search=${appliedFilters.search}`);
      if (appliedFilters.city) query.push(`city=${appliedFilters.city}`);
      if (appliedFilters.state) query.push(`state=${appliedFilters.state}`);
      if (appliedFilters.pin_code) query.push(`pin_code=${appliedFilters.pin_code}`);
      const url = `http://localhost:5000/api/customers/multiple-addresses${query.length ? `?${query.join("&")}` : ""}`;
      
      const res = await fetch(url);
      const data = await res.json();
      if (data.message === "success") setCustomers(data.data);
      else setCustomers([]);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching addresses");
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (customerId, address) => {
    setSelectedAddress({ ...address, customer_id: customerId });
    setShowModal(true);
  };

  const handleSaveAddress = async () => {
    const { address_id, address_details, city, state, pin_code } = selectedAddress;
    try {
      const res = await fetch(`http://localhost:5000/api/addresses/${address_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address_details, city, state, pin_code })
      });
      const data = await res.json();
      if (data.message === "address updated") {
        toast.success("Address updated successfully");
        setShowModal(false);
        fetchAddresses(filters);
      } else {
        toast.error("Failed to update address");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating address");
    }
  };

  const handleFilterApply = () => {
    setPage(1);
    fetchAddresses(filters);
  };

  const handleClearFilters = () => {
    setFilters({ search: "", city: "", state: "", pin_code: "" });
    setPage(1);
    fetchAddresses();
  };

  const paginatedData = customers.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6" style={{margin: "50px 200px"}}>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Customer Addresses</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 me-3">
        <input
          placeholder="Search by name"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="border px-3 py-2 rounded flex-1 me-3" 
        />
        <input
          placeholder="City"
          value={filters.city}
          onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
          className="border px-3 py-2 rounded flex-1 me-3"
        />
        <input
          placeholder="State"
          value={filters.state}
          onChange={(e) => setFilters(prev => ({ ...prev, state: e.target.value }))}
          className="border px-3 py-2 rounded flex-1 me-3"
        />
        <input
          placeholder="Pin Code"
          value={filters.pin_code}
          onChange={(e) => setFilters(prev => ({ ...prev, pin_code: e.target.value }))}
          className="border px-3 py-2 rounded flex-1 me-3"
        />
        <Button variant="primary" onClick={handleFilterApply} className="me-3">Apply</Button>
        <Button variant="secondary" onClick={handleClearFilters}>Clear</Button>
      </div>

      {/* Table */}
      <table className="table-auto border-collapse border border-gray-300 w-full text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Customer ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Addresses</th>
           
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(cust => (
            <tr key={cust.customer_id} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{cust.customer_id}</td>
              <td className="border px-4 py-2">{cust.first_name} {cust.last_name}</td>
              <td className="border px-4 py-2">
                {cust.addresses.map(addr => (
                  <div key={addr.address_id} className="mb-1">
                    {addr.address_details} - {addr.city}, {addr.state} ({addr.pin_code})
                    <button
                      className="ms-2 text-blue-600 underline"
                      onClick={() => openEditModal(cust.customer_id, addr)}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </td>
         
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <Button disabled={page === 1} onClick={() => setPage(prev => prev - 1)} className="me-3">Prev</Button>
        <span className="px-2 py-1 border me-3" >{page}</span>
        <Button disabled={page * ITEMS_PER_PAGE >= customers.length} onClick={() => setPage(prev => prev + 1)}>Next</Button>
      </div>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAddress && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Address Details</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAddress.address_details}
                  onChange={e => setSelectedAddress(prev => ({ ...prev, address_details: e.target.value }))}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAddress.city}
                  onChange={e => setSelectedAddress(prev => ({ ...prev, city: e.target.value }))}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAddress.state}
                  onChange={e => setSelectedAddress(prev => ({ ...prev, state: e.target.value }))}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Pin Code</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedAddress.pin_code}
                  onChange={e => setSelectedAddress(prev => ({ ...prev, pin_code: e.target.value }))}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveAddress}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MultipleAddressesPage;
