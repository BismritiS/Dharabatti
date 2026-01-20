import { Link } from 'react-router-dom';

function ForgotPassword() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-semibold">Forgot password</h1>
        <p className="mt-3 text-sm text-slate-300">
          Password reset is not implemented yet.
        </p>
        <div className="mt-6">
          <Link
            to="/login"
            className="inline-flex items-center rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
