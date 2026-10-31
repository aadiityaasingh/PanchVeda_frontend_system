import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getSetupStatus } from "../../api/authApi";
import { apiError } from "../../utils/formatters";

const InitialSetup = () => {
  const navigate = useNavigate();
  const { completeSetup } = useAuth();
  const [needsSetup, setNeedsSetup] = useState(null);
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getSetupStatus()
      .then((response) => setNeedsSetup(response.data.needsSetup))
      .catch((err) => {
        setError(apiError(err));
        setNeedsSetup(false);
      });
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await completeSetup(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 flex items-center justify-center p-5">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <p className="text-emerald-700 font-semibold tracking-widest text-xs uppercase">
          Panchveda - First-time setup
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Create the admin account
        </h1>
        <p className="mt-2 text-slate-500">
          This is available only until the first account is created.
        </p>
        {needsSetup === null && !error && (
          <p className="mt-6 text-slate-500">Checking setup status…</p>
        )}
        {error && (
          <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {needsSetup && (
          <form onSubmit={submit} className="mt-7 space-y-5">
            <label className="block text-sm font-medium text-slate-700">
              Your name
              <input
                required
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                placeholder="Full name"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                placeholder="admin@panchveda.com"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                required
                minLength="6"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-600"
                placeholder="At least 6 characters"
              />
            </label>
            <button
              disabled={saving}
              className="w-full rounded-xl bg-emerald-700 py-3 font-semibold text-white hover:bg-emerald-800 disabled:opacity-60 transition"
            >
              {saving ? "Creating account…" : "Create admin account"}
            </button>
          </form>
        )}
        {needsSetup === false && !error && (
          <p className="mt-6 rounded-lg bg-slate-100 p-4 text-sm text-slate-700">
            An account already exists. Ask an admin to create a staff account for you, or{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-700 hover:underline"
            >
              sign in
            </Link>
            .
          </p>
        )}
      </section>
    </main>
  );
};

export default InitialSetup;
