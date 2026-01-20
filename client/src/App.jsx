// src/App.jsx
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserManagement from './pages/UserManagement';
import BookingManagement from './pages/BookingManagement';
import ServiceManagement from './pages/ServiceManagement';
import Home from './pages/Home';
import Services from './pages/Services';
import BookService from "./pages/BookServices";
import CustomerDashboard from './pages/CustomerDashboard';
import ForgotPassword from './pages/ForgotPassword';
import RequireAdmin from './components/RequireAdmin';
import RequireAuth from './components/RequireAuth';
import { useAuth } from './context/AuthContext';

function App() {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top nav */}
      <nav className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6 text-xs font-medium sm:text-sm">
            <Link
              to="/"
              className="text-slate-100 hover:text-cyan-300"
            >
              DharaBatti Ityadi
            </Link>
            <Link
              to="/services"
              className="text-slate-300 hover:text-cyan-300"
            >
              Services
            </Link>
            <Link
              to="/book"
              className="text-slate-300 hover:text-cyan-300"
            >
              Book
            </Link>
            <Link
              to="/dashboard"
              className="text-slate-300 hover:text-cyan-300"
            >
              Dashboard
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin/users"
                  className="text-slate-300 hover:text-cyan-300"
                >
                  Admin – Users
                </Link>
                <Link
                  to="/admin/bookings"
                  className="text-slate-300 hover:text-cyan-300"
                >
                  Admin – Bookings
                </Link>
                <Link
                  to="/admin/services"
                  className="text-slate-300 hover:text-cyan-300"
                >
                  Admin – Services
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-300">
            {user ? (
              <>
                <span className="hidden sm:inline">
                  {user.email} ({user.role})
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded border border-slate-600 px-2 py-1 hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-cyan-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-slate-300 hover:text-cyan-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/book" element={<BookService />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <CustomerDashboard />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin/users"
          element={
            <RequireAdmin>
              <UserManagement />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <RequireAdmin>
              <BookingManagement />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/services"
          element={
            <RequireAdmin>
              <ServiceManagement />
            </RequireAdmin>
          }
        />
      </Routes>
    </div>
  );
}

export default App;