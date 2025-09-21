// App.jsx
import { Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import CustomerFormPage from "./pages/CustomerFormPage";
import CustomerListPage from "./pages/CustomerListPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import CustomerEditPage from "./pages/CustomerEditPage";
import MultipleAddressesPage from "./pages/MultipleAdreess";

function App() {
  return (
    <div className="p-6">
      <Routes>
        <Route path="/" element={<CustomerListPage />} />
        <Route path="/add" element={<CustomerFormPage />} />
        <Route path="/multiple-addresses" element={<MultipleAddressesPage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/customers/:id/edit" element={<CustomerEditPage />} />
      </Routes>
    </div>
  );
}

export default App;
