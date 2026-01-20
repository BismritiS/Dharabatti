// src/pages/UserManagement.jsx
import { useEffect, useState } from 'react';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../api/users';

// keep constants as objects: value (lowercase) + label (pretty)
const ROLE_OPTIONS = [
  { value: 'customer', label: 'Customer' },
  { value: 'provider', label: 'Provider' },
  { value: 'admin', label: 'Admin' },
];

const initialFormState = {
  id: null,
  fullName: '',
  email: '',
  phone: '',
  role: 'customer',
  password: '',
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadUsers = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchUsers({ page: pageNumber, limit: 10 });
      setUsers(data.data || []);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!form.id && !form.password) {
        throw new Error('Password is required when creating a new user.');
      }

      const payload = {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone || undefined,
        role: form.role,
      };

      if (form.password) {
        payload.password = form.password;
      }

      if (form.id) {
        await updateUser(form.id, payload);
        setSuccess('User updated successfully.');
      } else {
        await createUser(payload);
        setSuccess('User created successfully.');
      }

      resetForm();
      await loadUsers(page);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (user) => {
    setError('');
    setSuccess('');
    setForm({
      id: user.id,
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: (user.role || 'customer').toLowerCase(),
      password: '',
    });
  };

  const handleToggleStatus = async (user) => {
    const action = user.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`${action === 'deactivate' ? 'Deactivate' : 'Activate'} user "${user.fullName}"?`)) return;

    setError('');
    setSuccess('');

    try {
      if (user.isActive) {
        // Deactivate user
        await deleteUser(user.id);
        setSuccess('User deactivated successfully.');
      } else {
        // Activate user
        await updateUser(user.id, { isActive: true });
        setSuccess('User activated successfully.');
      }

      // Optimistically update local state so UI changes immediately
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isActive: !u.isActive } : u
        )
      );

      // Re-fetch from server to ensure consistency
      await loadUsers(page);
    } catch (err) {
      console.error(err);
      setError(err.message || `Failed to ${action} user`);
    }
  };
  
  const isEditing = Boolean(form.id);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800">
            DharaBatti Ityadi – User Management
          </h1>
          <span className="text-xs text-slate-500">
            Backend: /api/users (Node.js + Sequelize + MySQL)
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Form */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            {isEditing ? 'Edit User' : 'Create New User'}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-1 md:col-span-2">
              <label className="text-sm font-medium text-slate-700">
                {isEditing
                  ? 'Password (leave blank to keep current)'
                  : 'Password'}
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={
                  isEditing
                    ? 'Leave blank to keep existing password'
                    : 'At least 8 characters'
                }
                className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="mt-2 flex items-center space-x-2 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {saving
                  ? isEditing
                    ? 'Updating...'
                    : 'Creating...'
                  : isEditing
                  ? 'Update User'
                  : 'Create User'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Users table */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Users
            </h2>
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No users found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Role</th>
                    <th className="px-3 py-2">Active</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-3 py-2 text-xs text-slate-500">
                        {user.id}
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-sm font-medium text-slate-800">
                          {user.fullName}
                        </div>
                        {user.phone && (
                          <div className="text-xs text-slate-500">
                            {user.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700">
                        {user.email}
                      </td>
                      <td className="px-3 py-2 text-xs capitalize text-slate-600">
                        {user.role}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            user.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className={`rounded border px-2 py-1 text-xs hover:bg-opacity-10 ${
                              user.isActive
                                ? 'border-red-300 text-red-600 hover:bg-red-50'
                                : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
            <button
              className="rounded border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="rounded border border-slate-300 px-3 py-1 text-xs hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() =>
                setPage((p) => (p < totalPages ? p + 1 : p))
              }
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserManagement;