// src/pages/BookService.jsx
import { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { getAuth } from '../api/auth';
import { createBooking } from '../api/bookings';

const SERVICE_OPTIONS = [
  { value: 'electrical', label: 'Electrical repair' },
  { value: 'plumbing', label: 'Plumbing / Leak fix' },
  { value: 'cleaning', label: 'Home cleaning' },
  { value: 'painting', label: 'Painting' },
  { value: 'ac', label: 'AC & cooling' },
  { value: 'other', label: 'Other handyman' },
];

const URGENCY_OPTIONS = [
  { value: 'standard', label: 'Standard (Next 24–48 hours)' },
  { value: 'same_day', label: 'Same-day (subject to availability)' },
  { value: 'emergency', label: 'Emergency (within 2–3 hours)' },
];

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

function BookService() {
  const query = useQuery();
  const navigate = useNavigate();
  const preSelected = query.get('service');

  const auth = getAuth();
  const currentUser = auth?.user || null;

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Kathmandu',
    serviceType: preSelected || 'electrical',
    urgency: 'standard',
    date: '',
    timeSlot: '',
    description: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Prefill with logged-in user info
  useEffect(() => {
    if (currentUser) {
      setForm((prev) => ({
        ...prev,
        fullName: currentUser.fullName || prev.fullName,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  useEffect(() => {
    if (preSelected) {
      setForm((prev) => ({ ...prev, serviceType: preSelected }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSelected]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      setErrorMsg('Please login to book a service.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email || currentUser.email,
        address: form.address,
        city: form.city,
        serviceType: form.serviceType,
        urgency: form.urgency,
        scheduledDate: form.date || null,
        timeSlot: form.timeSlot,
        description: form.description,
      };

      await createBooking(payload);

      setSuccessMsg(
        'Your request has been submitted. You can track it from your dashboard.'
      );

      // Reset only per-booking fields
      setForm((prev) => ({
        ...prev,
        serviceType: prev.serviceType,
        urgency: 'standard',
        date: '',
        timeSlot: '',
        description: '',
      }));

      // Optionally redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const notLoggedInBanner = !currentUser && (
    <div className="mb-3 rounded-md border border-amber-400 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
      Please{' '}
      <Link
        to="/login"
        className="font-semibold text-amber-200 underline"
      >
        login
      </Link>{' '}
      or{' '}
      <Link
        to="/register"
        className="font-semibold text-amber-200 underline"
      >
        register
      </Link>{' '}
      to book a service and track it in your dashboard.
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-16 pt-10 lg:flex-row">
        <section className="w-full space-y-4 lg:w-2/3">
          <header>
            <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
              Book a Service
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Tell us about your property and the issue. We&apos;ll assign a
              verified professional and keep you updated at every step.
            </p>
          </header>

          {notLoggedInBanner}

          {errorMsg && (
            <div className="rounded-md border border-red-400 bg-red-500/10 px-3 py-2 text-xs text-red-100">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="rounded-md border border-emerald-400 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-100">
              {successMsg}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm shadow-slate-950/40"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Email (for updates)
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200">
                Address / Landmark
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Service Type
                </label>
                <select
                  name="serviceType"
                  value={form.serviceType}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                >
                  {SERVICE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Urgency
                </label>
                <select
                  name="urgency"
                  value={form.urgency}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                >
                  {URGENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Preferred Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-200">
                  Time Slot
                </label>
                <input
                  type="text"
                  name="timeSlot"
                  value={form.timeSlot}
                  onChange={handleChange}
                  placeholder="e.g. 10:00–12:00 or After 6 PM"
                  className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-200">
                Describe the issue
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Briefly describe the problem, access details, etc."
                required
                className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !currentUser}
              className="inline-flex items-center rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-cyan-500/30 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-cyan-500/50"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </section>

        {/* Side info same as before */}
        <aside className="w-full space-y-4 lg:w-1/3">
          <div className="rounded-2xl border border-emerald-500/50 bg-emerald-500/10 p-4 text-xs text-emerald-50">
            <p className="text-sm font-semibold">How it works</p>
            <ol className="mt-2 list-decimal space-y-1 pl-4 text-emerald-100/90">
              <li>Submit your request.</li>
              <li>We assign a nearby verified professional.</li>
              <li>Track status in your dashboard.</li>
              <li>Pay securely after completion.</li>
            </ol>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4 text-xs text-slate-200">
            <p className="text-sm font-semibold">Need help booking?</p>
            <p className="mt-1">
              Call{' '}
              <span className="font-semibold text-sky-300">
                +977-9800000000
              </span>{' '}
              or chat with us on WhatsApp for urgent assistance.
            </p>

            <Link
              to="/dashboard"
              className="mt-3 inline-flex text-xs font-medium text-cyan-300 hover:text-cyan-200"
            >
              Go to my dashboard →
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BookService;