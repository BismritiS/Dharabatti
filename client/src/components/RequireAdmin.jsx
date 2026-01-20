// src/components/RequireAdmin.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { getAuth } from '../api/auth';

function RequireAdmin({ children }) {
  const location = useLocation();
  const auth = getAuth();

  if (!auth || !auth.user || auth.user.role !== 'admin') {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname || '/admin/users' }}
      />
    );
  }

  return children;
}

export default RequireAdmin;