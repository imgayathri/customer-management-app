import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import CustomerFormPage from "./pages/CustomerFormPage";
import CustomerListPage from "./pages/CustomerListPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import CustomerEditPage from "./pages/CustomerEditPage";

function App() {
  return (
    <Router>
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
        <h1 className="font-bold text-xl">Customer Manager</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Customers</Link>
          <Link to="/add" className="hover:underline">Add Customer</Link>
        </div>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<CustomerListPage />} />
          <Route path="/add" element={<CustomerFormPage />} />
          <Route path="/customers/:id" element={<CustomerDetailPage />} />
          <Route path="/customers/:id/edit" element={<CustomerEditPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
