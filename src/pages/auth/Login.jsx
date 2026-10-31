import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiError } from "../../utils/formatters";
import {
  FaBolt,
  FaUserShield,
  FaUserMd,
  FaHandsHelping,
  FaLeaf,
} from "react-icons/fa";

const demoAccounts = [
  {
    roleName: "Admin",
    tagline: "Full access & billing",
    email: "admin@panchveda.com",
    password: "admin123",
    icon: <FaUserShield className="text-purple-600" />,
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
  },
  {
    roleName: "Doctor",
    tagline: "Patients & plans",
    email: "dr.ananya@panchveda.com",
    password: "doctor123",
    icon: <FaUserMd className="text-blue-600" />,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  {
    roleName: "Therapist",
    tagline: "Daily session logs",
    email: "vikram@panchveda.com",
    password: "therapist123",
    icon: <FaHandsHelping className="text-emerald-600" />,
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickLoadingRole, setQuickLoadingRole] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      setLoading(true);
      await login(formData);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (account) => {
    setError("");
    setQuickLoadingRole(account.roleName);
    setFormData({ email: account.email, password: account.password });
    try {
      await login({ email: account.email, password: account.password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(apiError(err));
      setQuickLoadingRole(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 flex items-center justify-center p-5">
      <section className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-base">
            <FaLeaf />
          </div>
          <span className="text-emerald-700 font-bold tracking-widest text-xs uppercase">
            Panchveda
          </span>
        </div>

        <h1 className="mt-3 text-3xl font-extrabold text-slate-900">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Ayurvedic clinical records & therapy management system.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl bg-red-50 p-3.5 text-sm text-red-700 border border-red-200"
          >
            {error}
          </div>
        )}

        {/* 1-Click Instant Demo Login Section */}
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-200">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white text-xs">
              <FaBolt />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              1-Click Demo Login (No typing needed)
            </span>
          </div>

          <p className="text-xs text-slate-500 mb-3">
            Exploring the project? Click any role below to sign in instantly with seeded data:
          </p>

          <div className="grid gap-2.5 sm:grid-cols-3">
            {demoAccounts.map((acc) => (
              <button
                key={acc.roleName}
                type="button"
                disabled={Boolean(quickLoadingRole) || loading}
                onClick={() => handleQuickDemoLogin(acc)}
                className={`flex flex-col items-center justify-center rounded-xl p-3 border transition-all text-center shadow-sm disabled:opacity-50 ${acc.badgeColor}`}
              >
                <div className="text-xl mb-1">{acc.icon}</div>
                <span className="font-bold text-sm leading-tight text-slate-900">
                  {quickLoadingRole === acc.roleName ? "Entering…" : acc.roleName}
                </span>
                <span className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                  {acc.tagline}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 border-t border-slate-200" />
          <span className="text-xs uppercase font-semibold text-slate-400">
            Or sign in manually
          </span>
          <div className="flex-1 border-t border-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
              placeholder="e.g. admin@panchveda.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition"
              placeholder="••••••••"
            />
          </div>

          <button
            disabled={loading || Boolean(quickLoadingRole)}
            className="w-full rounded-xl bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60 transition shadow-sm"
          >
            {loading ? "Signing in…" : "Sign In to Account"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-400">
          First-time center deployment?{" "}
          <Link
            className="font-semibold text-emerald-700 hover:underline"
            to="/setup"
          >
            Run Initial Setup
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;
