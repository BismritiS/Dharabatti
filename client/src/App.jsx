// src/App.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import UserManagement from './pages/UserManagement';
import Home from './pages/Home';
import Services from './pages/Services';
import BookService from "./pages/BookServices";
import CustomerDashboard from './pages/CustomerDashboard';
import RequireAdmin from './components/RequireAdmin';
import { getAuth, clearAuth } from './api/auth';

function App() {
  const auth = getAuth();
  const user = auth?.user || null;
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
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
                <Link
                  to="/admin/users"
                  className="text-slate-300 hover:text-cyan-300"
                >
                  Admin – Users
                </Link>
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
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/users"
            element={
              <RequireAdmin>
                <UserManagement />
              </RequireAdmin>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;