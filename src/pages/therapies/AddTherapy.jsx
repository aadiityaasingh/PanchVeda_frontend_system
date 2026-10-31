import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { createTherapy } from "../../api/therapyApi";
import { apiError } from "../../utils/formatters";
import { FaHeartbeat, FaArrowLeft } from "react-icons/fa";

const initialForm = {
  name: "",
  category: "",
  defaultDurationDays: "7",
  baseCost: "1500",
  description: "",
};

const AddTherapy = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      await createTherapy({
        name: form.name.trim(),
        category: form.category,
        defaultDurationDays: Number(form.defaultDurationDays),
        baseCost: Number(form.baseCost),
        description: form.description.trim() || undefined,
      });
      navigate("/therapies");
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
          onClick={() => navigate("/therapies")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <FaArrowLeft /> Back to Therapies
        </button>
      </div>

      <PageHeader
        title="Add New Therapy"
        subtitle="Introduce an Ayurvedic or Panchakarma procedure to the clinical offerings"
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
            <FaHeartbeat className="text-emerald-600" /> Therapy Specification
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Therapy Name *
            </label>
            <input
              required
              name="name"
              value={form.name}
              onChange={change}
              className={field}
              placeholder="e.g. Shirodhara, Janu Basti, Vamana"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Therapy Category *
            </label>
            <select
              required
              name="category"
              value={form.category}
              onChange={change}
              className={`${field} bg-white`}
            >
              <option value="">Select Panchakarma category</option>
              <option value="vamana">Vamana (Emesis Therapy)</option>
              <option value="virechana">Virechana (Purgation)</option>
              <option value="basti">Basti (Enema / Decoction)</option>
              <option value="nasya">Nasya (Nasal Administration)</option>
              <option value="raktamokshana">Raktamokshana (Bloodletting)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Default Recommended Duration (Days) *
            </label>
            <input
              required
              min="1"
              type="number"
              name="defaultDurationDays"
              value={form.defaultDurationDays}
              onChange={change}
              className={field}
              placeholder="e.g. 7"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Base Cost Per Day (₹) *
            </label>
            <input
              required
              min="0"
              type="number"
              name="baseCost"
              value={form.baseCost}
              onChange={change}
              className={field}
              placeholder="e.g. 1500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Clinical Description & Protocol (Optional)
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={change}
            rows="4"
            className={field}
            placeholder="Document indication, preparation guidelines (Purvakarma), standard medicated oils or herbs used, and contraindications..."
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save Therapy"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/therapies")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default AddTherapy;
