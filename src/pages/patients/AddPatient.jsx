import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { createPatient } from "../../api/patientApi";
import { apiError } from "../../utils/formatters";
import { FaUserPlus, FaArrowLeft } from "react-icons/fa";

const initialForm = {
  fullName: "",
  gender: "",
  dateOfBirth: "",
  phone: "",
  address: "",
  emergencyName: "",
  emergencyPhone: "",
  medicalNotes: "",
};

const AddPatient = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSaving(true);
      await createPatient({
        fullName: form.fullName.trim(),
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        phone: form.phone.trim(),
        address: form.address.trim() || undefined,
        emergencyContact:
          form.emergencyName.trim() || form.emergencyPhone.trim()
            ? {
                name: form.emergencyName.trim(),
                phone: form.emergencyPhone.trim(),
              }
            : undefined,
        medicalNotes: form.medicalNotes.trim() || undefined,
      });

      navigate("/patients");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const field =
    "w-full rounded-xl border border-slate-300 p-3 text-slate-800 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition";

  return (
    <DashboardLayout>
      <div className="mb-4">
        <button
          onClick={() => navigate("/patients")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <FaArrowLeft /> Back to Patients
        </button>
      </div>

      <PageHeader
        title="Register New Patient"
        subtitle="Create an Ayurvedic clinical profile for consultation and therapy planning"
      />

      <form
        onSubmit={submit}
        className="max-w-3xl space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
      >
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FaUserPlus className="text-blue-600" /> Basic Information
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Name *
            </label>
            <input
              required
              name="fullName"
              value={form.fullName}
              onChange={change}
              className={field}
              placeholder="e.g. Ramesh Chandra Verma"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Gender *
            </label>
            <select
              required
              name="gender"
              value={form.gender}
              onChange={change}
              className={`${field} bg-white`}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Date of Birth *
            </label>
            <input
              required
              type="date"
              name="dateOfBirth"
              max={new Date().toISOString().split("T")[0]}
              value={form.dateOfBirth}
              onChange={change}
              className={field}
            />
            <span className="text-xs text-slate-400 mt-1 block">
              Must be a date in the past
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Phone Number *
            </label>
            <input
              required
              name="phone"
              value={form.phone}
              onChange={change}
              className={field}
              placeholder="e.g. 9876543210"
            />
            <span className="text-xs text-slate-400 mt-1 block">
              10-digit Indian mobile number
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Residential Address
          </label>
          <input
            name="address"
            value={form.address}
            onChange={change}
            className={field}
            placeholder="e.g. Flat 302, Green Valley Apartments, Mumbai"
          />
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            Emergency Contact (Optional)
          </h2>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Contact Person Name
              </label>
              <input
                name="emergencyName"
                value={form.emergencyName}
                onChange={change}
                className={field}
                placeholder="Relative or guardian name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Emergency Phone Number
              </label>
              <input
                name="emergencyPhone"
                value={form.emergencyPhone}
                onChange={change}
                className={field}
                placeholder="Phone number"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h2 className="text-base font-bold text-slate-900 mb-2">
            Prakriti & Medical Notes (Optional)
          </h2>
          <textarea
            name="medicalNotes"
            value={form.medicalNotes}
            onChange={change}
            rows="4"
            className={field}
            placeholder="Document existing complaints, Prakriti assessment (Vata/Pitta/Kapha), known allergies, current medications..."
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <Button type="submit" disabled={saving}>
            {saving ? "Registering…" : "Register Patient"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/patients")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default AddPatient;
