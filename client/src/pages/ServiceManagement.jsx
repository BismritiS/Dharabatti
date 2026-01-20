// src/pages/ServiceManagement.jsx
import { useEffect, useState } from 'react';
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from '../api/services';

const CATEGORY_OPTIONS = [
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'cleaning', label: 'Home Cleaning' },
  { value: 'painting', label: 'Painting' },
  { value: 'ac', label: 'AC & Cooling' },
  { value: 'other', label: 'Others' },
];

const initialFormState = {
  id: null,
  name: '',
  category: 'electrical',
  description: '',
  icon: '🔧',
  badge: '',
  basePrice: '',
  duration: '',
  sortOrder: 0,
  isActive: true,
};

function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showInactive, setShowInactive] = useState(false);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getServices({ includeInactive: showInactive });
      setServices(data.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, [showInactive]);

  const resetForm = () => {
    setForm(initialFormState);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        name: form.name,
        category: form.category,
        description: form.description,
        icon: form.icon,
        badge: form.badge || undefined,
        basePrice: form.basePrice ? parseInt(form.basePrice, 10) : undefined,
        duration: form.duration || undefined,
        sortOrder: parseInt(form.sortOrder, 10) || 0,
        isActive: form.isActive,
      };

      if (form.id) {
        await updateService(form.id, payload);
        setSuccess('Service updated successfully.');
      } else {
        await createService(payload);
        setSuccess('Service created successfully.');
      }

      resetForm();
      await loadServices();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setError('');
    setSuccess('');
    setForm({
      id: service.id,
      name: service.name || '',
      category: service.category || 'electrical',
      description: service.description || '',
      icon: service.icon || '🔧',
      badge: service.badge || '',
      basePrice: service.basePrice ? service.basePrice.toString() : '',
      duration: service.duration || '',
      sortOrder: service.sortOrder ? service.sortOrder.toString() : '0',
      isActive: service.isActive !== undefined ? service.isActive : true,
    });
  };

  const handleToggleStatus = async (service) => {
    const action = service.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`${action === 'deactivate' ? 'Deactivate' : 'Activate'} service "${service.name}"?`)) return;

    setError('');
    setSuccess('');

    try {
      if (service.isActive) {
        // Deactivate service
        await deleteService(service.id);
        setSuccess('Service deactivated successfully.');
      } else {
        // Activate service
        await updateService(service.id, { isActive: true });
        setSuccess('Service activated successfully.');
      }

      // Optimistically update local state so UI changes immediately
      setServices((prev) =>
        prev.map((s) =>
          s.id === service.id ? { ...s, isActive: !s.isActive } : s
        )
      );

      // Re-fetch from server to ensure consistency
      await loadServices();
    } catch (err) {
      console.error(err);
      setError(err.message || `Failed to ${action} service`);
    }
  };

  const isEditing = Boolean(form.id);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800">
            DharaBatti Ityadi – Service Management
          </h1>
          <span className="text-xs text-slate-500">
            Backend: /api/services (Node.js + Sequelize + MySQL)
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
            {isEditing ? 'Edit Service' : 'Create New Service'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Service Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Icon
                </label>
                <input
                  type="text"
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  maxLength={10}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="🔧"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Badge
                </label>
                <input
                  type="text"
                  name="badge"
                  value={form.badge}
                  onChange={handleChange}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Popular, Emergency"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Base Price (Rs.)
                </label>
                <input
                  type="number"
                  name="basePrice"
                  value={form.basePrice}
                  onChange={handleChange}
                  min="0"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="500"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., 1-2 hours"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sortOrder"
                  value={form.sortOrder}
                  onChange={handleChange}
                  min="0"
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm text-slate-700">
                    Active
                  </label>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
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
                  ? 'Update Service'
                  : 'Create Service'}
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

        {/* Services table */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Services
            </h2>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Show inactive</span>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Loading services...
            </div>
          ) : services.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No services found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Icon</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Category</th>
                    <th className="px-3 py-2">Price</th>
                    <th className="px-3 py-2">Duration</th>
                    <th className="px-3 py-2">Active</th>
                    <th className="px-3 py-2">Order</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr
                      key={service.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-3 py-2 text-xs text-slate-500">
                        {service.id}
                      </td>
                      <td className="px-3 py-2 text-lg">
                        {service.icon}
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-sm font-medium text-slate-800">
                          {service.name}
                        </div>
                        {service.badge && (
                          <div className="text-xs text-slate-500">
                            {service.badge}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs capitalize text-slate-600">
                        {service.category}
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700">
                        {service.basePrice ? `Rs. ${service.basePrice}` : 'Not set'}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-600">
                        {service.duration || 'Not set'}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                            service.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-600">
                        {service.sortOrder}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(service)}
                            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(service)}
                            className={`rounded border px-2 py-1 text-xs hover:bg-opacity-10 ${
                              service.isActive
                                ? 'border-red-300 text-red-600 hover:bg-red-50'
                                : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                            }`}
                          >
                            {service.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default ServiceManagement;
