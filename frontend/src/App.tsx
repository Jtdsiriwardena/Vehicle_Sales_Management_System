import { Routes, Route } from "react-router-dom";
import Login from "./pages/admin/Login";
import ProtectedRoute from "./components/ProtectedRoute";


// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import VehicleCreate from "./pages/admin/VehicleCreate";
import Analytics from "./pages/admin/Analytics";
import Sidebar from "./components/admin/Sidebar";

// Customer Pages
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerVehicleDetail from "./pages/customer/VehicleDetail";

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
<div className="flex">
  {/* Sidebar*/}
  <div className="w-64 h-screen fixed top-0 left-0 bg-gray-100 text-white">
    <Sidebar />
  </div>

  {/* Main content*/}
  <div className="flex-1 ml-64 p-4 bg-gray-100">
    {children}
  </div>
</div>

);

function App() {
  return (
    <Routes>
      {/* Admin Login route */}
      <Route path="/adminLogin" element={<Login />} />

      {/* Admin pages routes */}
      <Route
        path="/dashboard"
        element={
           <ProtectedRoute>
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/vehicles/create"
        element={
          <ProtectedRoute>
          <AdminLayout>
            <VehicleCreate />
          </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute>
          <AdminLayout>
            <Analytics/>
          </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* Customer routes */}
      <Route path="/" element={<CustomerDashboard />} />
      <Route path="/vehicle/:id" element={<CustomerVehicleDetail />} />
    </Routes>
  );
}

export default App;
