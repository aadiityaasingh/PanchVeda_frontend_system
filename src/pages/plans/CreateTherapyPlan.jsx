import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import { getPatients } from "../../api/patientApi";
import { getTherapies } from "../../api/therapyApi";
import { createTherapyPlan } from "../../api/therapyPlanApi";
import { apiError, formatCurrency } from "../../utils/formatters";
import {
  FaCalendarPlus,
  FaArrowLeft,
  FaTrashAlt,
  FaPlus,
  FaCheck,
  FaLeaf,
} from "react-icons/fa";

const blankItem = { therapy: "", durationDays: "7", costPerDay: "1500" };

const MAIN_CATEGORIES = ["vamana", "virechana", "basti", "nasya", "raktamokshana"];

const CreateTherapyPlan = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialPatientId = searchParams.get("patientId") || "";

  const [patients, setPatients] = useState([]);
  const [therapies, setTherapies] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingTherapies, setLoadingTherapies] = useState(true);

  const todayStr = new Date().toISOString().split("T")[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextWeekStr = nextWeek.toISOString().split("T")[0];

  const [form, setForm] = useState({
    patient: initialPatientId,
    startDate: todayStr,
    endDate: nextWeekStr,
    notes: "",
    therapies: [{ ...blankItem }],
  });

  const loadData = () => {
    setLoadingTherapies(true);
    Promise.all([getPatients({ limit: 100 }), getTherapies()])
      .then(([p, t]) => {
        setPatients(p.data || []);
        const loadedTherapies = t.data || [];
        setTherapies(loadedTherapies);
      })
      .catch((e) => setError(apiError(e)))
      .finally(() => setLoadingTherapies(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  // If patientId is passed via URL, ensure it's selected
  useEffect(() => {
    if (initialPatientId && !form.patient) {
      setForm((prev) => ({ ...prev, patient: initialPatientId }));
    }
  }, [initialPatientId]);

  // Split into 5 Main Panchakarma Therapies and Others
  const { coreTherapies, otherTherapies } = useMemo(() => {
    const core = [];
    const others = [];

    // Order core therapies by standard classical Panchakarma sequence:
    // 1. Vamana, 2. Virechana, 3. Basti, 4. Nasya, 5. Raktamokshana
    MAIN_CATEGORIES.forEach((cat) => {
      const match = therapies.find(
        (t) => t.category?.toLowerCase() === cat
      );
      if (match) core.push(match);
    });

    therapies.forEach((t) => {
      if (!core.some((c) => c._id === t._id)) {
        others.push(t);
      }
    });

    return { coreTherapies: core, otherTherapies: others };
  }, [therapies]);

  const updateItem = (index, field, value) => {
    const items = [...form.therapies];
    items[index] = { ...items[index], [field]: value };

    if (field === "therapy") {
      const selected = therapies.find((t) => t._id === value);
      if (selected) {
        items[index] = {
          ...items[index],
          therapy: value,
          durationDays: String(selected.defaultDurationDays || 7),
          costPerDay: String(selected.baseCost || 1500),
        };
      }
    }

    setForm({ ...form, therapies: items });

    // Suggest new end date if max therapy days exceeds current plan duration
    if (field === "durationDays" || field === "therapy") {
      const maxDays = Math.max(
        ...items.map((i) => Number(i.durationDays) || 1)
      );
      if (form.startDate) {
        const start = new Date(form.startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + maxDays - 1);
        const suggestedEndStr = end.toISOString().split("T")[0];
        if (new Date(form.endDate) < end) {
          setForm((prev) => ({
            ...prev,
            therapies: items,
            endDate: suggestedEndStr,
          }));
          return;
        }
      }
    }
  };

  const addItem = () => {
    setForm({
      ...form,
      therapies: [...form.therapies, { ...blankItem }],
    });
  };

  const removeItem = (index) => {
    setForm({
      ...form,
      therapies: form.therapies.filter((_, i) => i !== index),
    });
  };

  // Quick-add a specific therapy from the 5 Main Panchakarma bar
  const handleQuickAdd = (therapyObj) => {
    const alreadyAdded = form.therapies.some(
      (item) => item.therapy === therapyObj._id
    );

    if (alreadyAdded) {
      // Remove it if clicked again
      if (form.therapies.length > 1) {
        setForm({
          ...form,
          therapies: form.therapies.filter(
            (item) => item.therapy !== therapyObj._id
          ),
        });
      } else {
        setForm({
          ...form,
          therapies: [{ ...blankItem }],
        });
      }
      return;
    }

    // Check if the only existing item is empty/unselected
    if (
      form.therapies.length === 1 &&
      (!form.therapies[0].therapy || form.therapies[0].therapy === "")
    ) {
      updateItem(0, "therapy", therapyObj._id);
    } else {
      const newItem = {
        therapy: therapyObj._id,
        durationDays: String(therapyObj.defaultDurationDays || 7),
        costPerDay: String(therapyObj.baseCost || 1500),
      };
      const updated = [...form.therapies, newItem];
      setForm({ ...form, therapies: updated });

      // Adjust end date if needed
      const maxDays = Math.max(
        ...updated.map((i) => Number(i.durationDays) || 1)
      );
      if (form.startDate) {
        const start = new Date(form.startDate);
        const end = new Date(start);
        end.setDate(end.getDate() + maxDays - 1);
        const suggestedEndStr = end.toISOString().split("T")[0];
        if (new Date(form.endDate) < end) {
          setForm((prev) => ({ ...prev, endDate: suggestedEndStr }));
        }
      }
    }
  };

  const total = useMemo(
    () =>
      form.therapies.reduce(
        (sum, item) =>
          sum +
          (Number(item.durationDays) || 0) * (Number(item.costPerDay) || 0),
        0
      ),
    [form.therapies]
  );

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate duplicate therapies
    const therapyIds = form.therapies.map((t) => t.therapy).filter(Boolean);
    const uniqueIds = new Set(therapyIds);
    if (therapyIds.length !== uniqueIds.size) {
      setError("Please ensure there are no duplicate therapies in this plan.");
      return;
    }

    try {
      setSaving(true);
      await createTherapyPlan({
        ...form,
        therapies: form.therapies.map((item) => ({
          therapy: item.therapy,
          durationDays: Number(item.durationDays),
          costPerDay: Number(item.costPerDay),
        })),
      });

      navigate("/plans");
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
          onClick={() => navigate("/plans")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
        >
          <FaArrowLeft /> Back to Therapy Plans
        </button>
      </div>

      <PageHeader
        title="Create Therapy Plan"
        subtitle="Schedule a multi-day Panchakarma regimen and automatically generate sessions & billing"
      />

      <form
        onSubmit={submit}
        className="max-w-4xl space-y-6 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200"
      >
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FaCalendarPlus className="text-blue-600" /> Patient & Schedule
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Select Patient *
            </label>
            <select
              required
              value={form.patient}
              onChange={(e) => setForm({ ...form, patient: e.target.value })}
              className={`${field} bg-white`}
            >
              <option value="">Select patient…</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.fullName} ({p.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Start Date *
            </label>
            <input
              required
              type="date"
              min={todayStr}
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className={field}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              End Date *
            </label>
            <input
              required
              type="date"
              min={form.startDate || todayStr}
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className={field}
            />
          </div>
        </div>

        {/* 5 Main Panchakarma Quick-Add Selector */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaLeaf className="text-emerald-700" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900">
                The 5 Main Panchakarma Therapies
              </h3>
            </div>
            <span className="text-xs text-emerald-700 font-medium hidden sm:inline">
              Click to quickly add / toggle in plan
            </span>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-5">
            {coreTherapies.map((ct) => {
              const isSelected = form.therapies.some(
                (item) => item.therapy === ct._id
              );
              return (
                <button
                  type="button"
                  key={ct._id}
                  onClick={() => handleQuickAdd(ct)}
                  className={`flex flex-col justify-between rounded-xl p-3 text-left transition-all ${
                    isSelected
                      ? "border-2 border-emerald-600 bg-white shadow-md text-emerald-900"
                      : "border border-emerald-200 bg-white/80 hover:bg-white hover:border-emerald-400 text-slate-800"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                      {ct.category}
                    </span>
                    {isSelected && (
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                        <FaCheck />
                      </span>
                    )}
                  </div>
                  <div className="mt-1 font-semibold text-sm leading-tight text-slate-900">
                    {ct.name}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    {ct.defaultDurationDays} days · {formatCurrency(ct.baseCost)}/d
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Therapy Selection Items */}
        <div className="border-t border-slate-100 pt-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Prescribed Therapies ({form.therapies.length})
              </h2>
              <p className="text-xs text-slate-500">
                Adjust days and rates per therapy as needed for this patient
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="flex items-center gap-1.5 text-xs py-1.5"
            >
              <FaPlus /> Add Another Therapy
            </Button>
          </div>

          <div className="space-y-3">
            {form.therapies.map((item, index) => (
              <div
                key={index}
                className="grid gap-3 sm:grid-cols-[3fr_1.5fr_1.5fr_auto] items-end rounded-xl bg-slate-50 p-4 border border-slate-200"
              >
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Therapy #{index + 1} *
                  </label>
                  <select
                    required
                    value={item.therapy}
                    onChange={(e) =>
                      updateItem(index, "therapy", e.target.value)
                    }
                    className={`${field} bg-white text-sm py-2`}
                  >
                    <option value="">Select a therapy…</option>

                    {coreTherapies.length > 0 && (
                      <optgroup label="🌟 The 5 Main Panchakarma Therapies">
                        {coreTherapies.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name} ({t.category?.toUpperCase()})
                          </option>
                        ))}
                      </optgroup>
                    )}

                    {otherTherapies.length > 0 && (
                      <optgroup label="Additional Therapies">
                        {otherTherapies.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.name} ({t.category?.toUpperCase()})
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Duration (Days) *
                  </label>
                  <input
                    required
                    min="1"
                    type="number"
                    value={item.durationDays}
                    onChange={(e) =>
                      updateItem(index, "durationDays", e.target.value)
                    }
                    className={`${field} bg-white text-sm py-2`}
                    placeholder="Days"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Cost / Day (₹) *
                  </label>
                  <input
                    required
                    min="0"
                    type="number"
                    value={item.costPerDay}
                    onChange={(e) =>
                      updateItem(index, "costPerDay", e.target.value)
                    }
                    className={`${field} bg-white text-sm py-2`}
                    placeholder="Rate"
                  />
                </div>

                <div className="pb-1">
                  <Button
                    type="button"
                    variant="danger"
                    disabled={form.therapies.length === 1}
                    onClick={() => removeItem(index)}
                    className="p-2.5 text-xs"
                    title="Remove therapy"
                  >
                    <FaTrashAlt />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Doctor's Clinical Notes / Plan Instructions
          </label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className={field}
            rows="3"
            placeholder="Special diet restrictions (Pathya/Apathya), herbal decoctions prescribed alongside, daily timings..."
          />
        </div>

        {/* Total Cost Card */}
        <div className="rounded-xl bg-emerald-50 p-5 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-emerald-800">
              Total Invoiced Plan Amount
            </span>
            <p className="text-xs text-emerald-600">
              Sum of daily rates across all prescribed therapy durations
            </p>
          </div>
          <span className="text-3xl font-extrabold text-emerald-900">
            {formatCurrency(total)}
          </span>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-100">
          <Button type="submit" disabled={saving}>
            {saving ? "Creating plan & sessions…" : "Confirm & Create Plan"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/plans")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </DashboardLayout>
  );
};

export default CreateTherapyPlan;
