// src/pages/Services.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getServices } from '../api/services';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getServices();
        setServices(data.data || []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="flex items-center justify-center py-20">
            <div className="text-slate-400">Loading services...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="flex items-center justify-center py-20">
            <div className="text-red-400">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
          <div className="flex items-center justify-center py-20">
            <div className="text-slate-400">No services available at the moment.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-slate-50 sm:text-3xl">
            Browse Services
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Choose from vetted professionals across electrical, plumbing,
            cleaning, painting, and more. Book instantly and track every job
            from your dashboard.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm shadow-slate-950/40"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-xl">
                    {service.icon}
                  </span>
                  <h2 className="text-sm font-semibold text-slate-50">
                    {service.name}
                  </h2>
                </div>
                {service.badge && (
                  <span className="rounded-full bg-sky-500/15 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-sky-200">
                    {service.badge}
                  </span>
                )}
              </div>

              <p className="flex-1 text-xs leading-relaxed text-slate-300">
                {service.description}
              </p>

              <div className="mt-4 flex items-center justify-between text-xs">
                <Link
                  to={`/book?service=${encodeURIComponent(service.category)}`}
                  className="inline-flex items-center rounded-lg bg-cyan-500 px-3 py-1.5 font-medium text-slate-950 hover:bg-cyan-400"
                >
                  Book now
                </Link>
                <div className="text-right">
                  {service.basePrice && (
                    <div className="text-[11px] text-slate-400">
                      From Rs. {service.basePrice}
                    </div>
                  )}
                  <div className="text-[11px] text-slate-500">
                    {service.duration || 'Variable duration'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-xs text-emerald-50">
            <p className="font-semibold text-sm">Verified & insured</p>
            <p className="mt-1 text-emerald-100/90">
              All professionals pass KYC and background checks to keep your home
              safe and secure.
            </p>
          </div>
          <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs text-amber-50">
            <p className="font-semibold text-sm">Transparent pricing</p>
            <p className="mt-1 text-amber-100/90">
              Upfront estimates, clear scope, and digital invoices for every
              booking.
            </p>
          </div>
          <div className="rounded-2xl border border-sky-500/40 bg-sky-500/10 p-4 text-xs text-sky-50">
            <p className="font-semibold text-sm">Smart scheduling</p>
            <p className="mt-1 text-sky-100/90">
              Pick time slots that work for you — morning, evening, or
              emergencies.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Services;