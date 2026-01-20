import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAuth, clearAuth } from '../api/auth';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const auth = getAuth();
  const user = auth?.user || null;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', requiresAuth: true },
    { name: 'Services', path: '/services' },
    { name: 'Book Now', path: '/book', highlight: true },
    ...(isAdmin ? [{ name: 'Admin', path: '/admin/users' }] : []),
  ];

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          DharaBatti
        </Link>

        {/* Desktop Navigation */}
        <nav className="navbar-links">
          {navLinks.map((link) => {
            if (link.requiresAuth && !user) return null;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive ? 'active' : ''} ${link.highlight ? 'highlight' : ''}`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User/Auth Buttons */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <button className="user-button">
                <span className="user-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span>{user.name.split(' ')[0]}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="user-menu-dropdown">
                <Link to="/profile" className="user-menu-item">
                  Your Profile
                </Link>
                <div className="user-menu-divider"></div>
                <button onClick={handleLogout} className="user-menu-item text-rose-400 hover:text-rose-300">
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Sign in
              </Link>
              <Link to="/register" className="nav-link highlight">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <nav className="space-y-1">
          {navLinks.map((link) => {
            if (link.requiresAuth && !user) return null;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={`mobile-${link.path}`}
                to={link.path}
                className={`mobile-nav-link ${isActive ? 'active' : ''} ${link.highlight ? 'highlight' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            );
          })}
          
          {user ? (
            <>
              <div className="user-menu-divider"></div>
              <Link
                to="/profile"
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Your Profile
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="mobile-nav-link text-rose-400 hover:text-rose-300 w-full text-left"
              >
                Sign out
              </button>
            </>
          ) : (
            <div className="mobile-auth-section">
              <Link
                to="/login"
                className="mobile-auth-button primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign in
              </Link>
              <p className="text-center text-sm text-slate-400 mt-4">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-cyan-400 hover:text-cyan-300 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign up
                </Link>
              </p>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
