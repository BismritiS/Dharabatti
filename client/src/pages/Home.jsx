// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import ThreeDHexBackground from '../components/ThreeDHexBackground';

const services = [
  {
    id: 1,
    name: 'Deep Cleaning',
    description: 'Thorough cleaning of your entire home, including hard-to-reach areas.',
    price: 'NPR 5,000',
    duration: '4-6 hours',
    tag: 'Most Popular'
  },
  {
    id: 2,
    name: 'Regular Cleaning',
    description: 'Standard cleaning of your living spaces to keep your home fresh and tidy.',
    price: 'NPR 3,500',
    duration: '2-3 hours'
  },
  {
    id: 3,
    name: 'Office Cleaning',
    description: 'Professional cleaning services for your workplace to maintain a healthy environment.',
    price: 'NPR 7,500',
    duration: '5-7 hours'
  }
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28">
        <ThreeDHexBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">Professional Home</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Cleaning Services
              </span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-slate-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Book professional home cleaning services in Kathmandu. Our vetted professionals provide top-quality cleaning with 100% satisfaction guaranteed.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/book"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Book Now
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-cyan-400 bg-slate-800/50 hover:bg-slate-700/50 transition-colors duration-200"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="relative py-16 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Our Services
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-slate-300">
              Professional cleaning services tailored to your needs
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="relative bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                {service.tag && (
                  <span className="absolute -top-3 right-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {service.tag}
                  </span>
                )}
                <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">{service.name}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-cyan-400">
                    {service.price}
                  </span>
                  <span className="text-xs text-slate-400">
                    {service.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-slate-700/50 hover:bg-slate-600/50 transition-colors duration-200"
            >
              View All Services
              <svg
                className="ml-2 -mr-1 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-800/50 rounded-2xl p-8 md:p-12 shadow-xl border border-slate-700/50">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Ready to experience the difference?
                </h2>
                <p className="mt-3 text-lg text-slate-300">
                  Join thousands of satisfied customers who trust us with their
                  homes.
                </p>
              </div>
              <div className="mt-6 md:mt-0 md:ml-8">
                <Link
                  to="/book"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Book Your Cleaning Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}