// src/pages/BookingManagement.jsx
import { useEffect, useState } from 'react';
import { getAllBookings } from '../api/bookings';

const STATUS_OPTIONS = [
  { value: 'Pending', label: 'Pending', color: 'bg-yellow-50 text-yellow-700' },
  { value: 'In Progress', label: 'In Progress', color: 'bg-blue-50 text-blue-700' },
  { value: 'Completed', label: 'Completed', color: 'bg-emerald-50 text-emerald-700' },
  { value: 'Cancelled', label: 'Cancelled', color: 'bg-red-50 text-red-700' },
];

const URGENCY_OPTIONS = [
  { value: 'standard', label: 'Standard', color: 'bg-slate-50 text-slate-600' },
  { value: 'same_day', label: 'Same Day', color: 'bg-orange-50 text-orange-700' },
  { value: 'emergency', label: 'Emergency', color: 'bg-red-50 text-red-700' },
];

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');

  const loadBookings = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllBookings();
      let filteredBookings = data.data || [];

      // Apply filters
      if (filterStatus) {
        filteredBookings = filteredBookings.filter(booking => booking.status === filterStatus);
      }
      if (filterUrgency) {
        filteredBookings = filteredBookings.filter(booking => booking.urgency === filterUrgency);
      }

      // Simple pagination (client-side for now)
      const itemsPerPage = 10;
      const startIndex = (pageNumber - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

      setBookings(paginatedBookings);
      setTotalPages(Math.ceil(filteredBookings.length / itemsPerPage));
      setPage(pageNumber);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filterStatus, filterUrgency]);

  const getStatusBadge = (status) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return statusOption || STATUS_OPTIONS[0];
  };

  const getUrgencyBadge = (urgency) => {
    const urgencyOption = URGENCY_OPTIONS.find(u => u.value === urgency);
    return urgencyOption || URGENCY_OPTIONS[0];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    // This would need a backend API endpoint to update booking status
    // For now, we'll just show a message
    setSuccess(`Status update functionality would be implemented here for booking ${bookingId}`);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-slate-800">
            DharaBatti Ityadi – Booking Management
          </h1>
          <span className="text-xs text-slate-500">
            Backend: /api/bookings (Node.js + Sequelize + MySQL)
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
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

        {/* Filters */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Filters
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setPage(1);
                }}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-slate-700">
                Urgency
              </label>
              <select
                value={filterUrgency}
                onChange={(e) => {
                  setFilterUrgency(e.target.value);
                  setPage(1);
                }}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">All Urgencies</option>
                {URGENCY_OPTIONS.map((urgency) => (
                  <option key={urgency.value} value={urgency.value}>
                    {urgency.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterStatus('');
                  setFilterUrgency('');
                  setPage(1);
                }}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </section>

        {/* Bookings table */}
        <section className="rounded-lg bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Bookings
            </h2>
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No bookings found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Service</th>
                    <th className="px-3 py-2">Urgency</th>
                    <th className="px-3 py-2">Scheduled</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-3 py-2 text-xs text-slate-500">
                        {booking.id}
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-sm font-medium text-slate-800">
                          {booking.fullName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {booking.email}
                        </div>
                        <div className="text-xs text-slate-500">
                          {booking.phone}
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <div className="text-sm text-slate-700">
                          {booking.serviceType}
                        </div>
                        <div className="text-xs text-slate-500 max-w-xs truncate">
                          {booking.description}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${getUrgencyBadge(booking.urgency).color}`}
                        >
                          {getUrgencyBadge(booking.urgency).label}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-600">
                        {formatDate(booking.scheduledDate)}
                        {booking.timeSlot && (
                          <div className="text-xs text-slate-500">
                            {booking.timeSlot}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${getStatusBadge(booking.status).color}`}
                        >
                          {getStatusBadge(booking.status).label}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-slate-700">
                        {booking.amount ? `Rs. ${booking.amount}` : 'Not set'}
                      </td>
                      <td className="px-3 py-2 text-xs">
                        <div className="flex space-x-2">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusUpdate(booking.id, e.target.value)}
                            className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-700 hover:bg-slate-100"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status.value} value={status.value}>
                                {status.label}
                              </option>
                            ))}
                          </select>
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

export default BookingManagement;
