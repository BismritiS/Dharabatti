// src/pages/CustomerDashboard.jsx
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAuth } from '../api/auth';
import { getMyBookings } from '../api/bookings';
import ThreeDHexBackground from '../components/ThreeDHexBackground';

const STATUS_STYLES = {
  Completed:
    'bg-green-50 text-green-700 border border-green-200 text-[11px]',
  'In Progress':
    'bg-amber-50 text-amber-700 border border-amber-200 text-[11px]',
  Pending:
    'bg-slate-100 text-slate-600 border border-slate-200 text-[11px]',
  Cancelled:
    'bg-rose-50 text-rose-700 border border-rose-200 text-[11px]',
};

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
    </div>
  );
}

function CustomerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const auth = getAuth();
  const user = auth?.user || null;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const initialLoad = useRef(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setAuthChecked(true);
      } catch (err) {
        console.error('Auth check error:', err);
        setError('Failed to verify authentication status');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Load bookings when user is authenticated
  useEffect(() => {
    if (!user) return; // Only proceed if user exists
    if (!initialLoad.current) return; // Only run on initial load

    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;
    let retryTimer;

    const loadBookings = async () => {
      try {
        setLoading(true);
        const res = await getMyBookings({ signal });
        
        if (isMounted) {
          setBookings(res.data || []);
          setError('');
          initialLoad.current = false; // Mark initial load as complete
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Failed to load bookings:', err);
          if (isMounted) {
            setError(err.message || 'Failed to load bookings. Please try again.');
            // Auto-retry after 5 seconds if there's an error
            retryTimer = setTimeout(() => {
              if (isMounted) loadBookings();
            }, 5000);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBookings();

    // Cleanup function to cancel any pending requests and timeouts
    return () => {
      isMounted = false;
      controller.abort();
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [user]); // Only depend on user

  // Show loading state until we've checked auth
  if (isLoading || !authChecked) {
    return (
      <div className="relative min-h-screen bg-slate-950 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Show error state if there's an error and no bookings
  if (error && bookings.length === 0) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-rose-400 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
        <ThreeDHexBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="bg-slate-900/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-slate-700/50">
            <h2 className="text-2xl font-bold text-cyan-300 mb-3">Session Expired</h2>
            <p className="text-slate-300 mb-6">Please sign in to access your dashboard</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-lg bg-cyan-600 hover:bg-cyan-500 px-5 py-2.5 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const completed = bookings.filter((b) => b.status === 'Completed');
  const inProgress = bookings.filter((b) => b.status === 'In Progress');
  const pending = bookings.filter((b) => b.status === 'Pending');
  const total = bookings.reduce(
    (sum, b) => sum + (b.amount || 0),
    0
  );

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-50 overflow-hidden">
      <ThreeDHexBackground />
      <div className="relative z-10">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
          <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
                My Dashboard
              </h1>
              <p className="mt-1 text-xs text-slate-300 sm:text-sm">
                Track your DharaBatti bookings with live statuses and
                history tied to your account.
              </p>
              <p className="mt-1 text-[11px] text-emerald-100/80">
                Jobs successfully closed: {completed.length}
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 sm:mt-0">
              <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3">
                <p className="text-xs text-amber-100/90">In Progress</p>
                <p className="mt-1 text-xl font-semibold text-amber-100">
                  {inProgress.length}
                </p>
                <p className="mt-1 text-[11px] text-amber-100/80">
                  Currently being serviced
                </p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-3">
                <p className="text-xs text-slate-300">Pending</p>
                <p className="mt-1 text-xl font-semibold text-slate-50">
                  {pending.length}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Awaiting confirmation
                </p>
              </div>
              <div className="rounded-2xl border border-sky-500/40 bg-sky-500/10 p-3">
                <p className="text-xs text-sky-100">Total spend (approx.)</p>
                <p className="mt-1 text-xl font-semibold text-sky-50">
                  NPR {total.toLocaleString()}
                </p>
                <p className="mt-1 text-[11px] text-sky-100/80">
                  Across {bookings.length} bookings
                </p>
              </div>
            </div>
          </header>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-100">
              My bookings
            </h2>
            <p className="text-[11px] text-slate-400">
              Status: Completed · In Progress · Pending · Cancelled
            </p>
          </div>

          {loading ? (
            <div className="py-12">
              <LoadingSpinner />
              <p className="mt-2 text-center text-xs text-slate-400">Loading your bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No bookings yet.{' '}
              <Link
                to="/book"
                className="font-medium text-cyan-300 hover:text-cyan-200"
              >
                Book your first service →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-xs text-slate-200">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="px-3 py-2">ID</th>
                    <th className="px-3 py-2">Service</th>
                    <th className="px-3 py-2">Date / Slot</th>
                    <th className="px-3 py-2">City</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="border-b border-slate-800/80 last:border-0 hover:bg-slate-900"
                    >
                      <td className="px-3 py-2 text-[11px] text-slate-400">
                        #{b.id}
                      </td>
                      <td className="px-3 py-2 text-xs text-slate-100">
                        {b.serviceType}
                      </td>
                      <td className="px-3 py-2 text-[11px] text-slate-300">
                        {b.scheduledDate || 'Flexible'}{' '}
                        {b.timeSlot && `· ${b.timeSlot}`}
                      </td>
                      <td className="px-3 py-2 text-[11px] text-slate-300">
                        {b.city}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 font-medium ${
                            STATUS_STYLES[b.status] || STATUS_STYLES.Pending
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-xs text-slate-100">
                        {b.amount
                          ? `NPR ${b.amount.toLocaleString()}`
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;