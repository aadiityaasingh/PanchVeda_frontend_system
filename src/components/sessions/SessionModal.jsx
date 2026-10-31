import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { updateSessionStatus } from "../../api/sessionApi";
import { apiError, formatDate } from "../../utils/formatters";
import { FaHeartbeat, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const SessionModal = ({ isOpen, onClose, session, onSuccess }) => {
  const [status, setStatus] = useState("completed");
  const [bp, setBp] = useState("");
  const [pulse, setPulse] = useState("");
  const [tolerance, setTolerance] = useState("Well Tolerated (Samyak)");
  const [pathyaAdvised, setPathyaAdvised] = useState(true);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      setStatus(session.status === "scheduled" ? "completed" : session.status || "completed");

      const rawNotes = session.notes || "";
      const vitalsMatch = rawNotes.match(/\[Vitals:\s*([^\]]+)\]/);
      if (vitalsMatch) {
        const vitalsStr = vitalsMatch[1];
        const bpMatch = vitalsStr.match(/BP:\s*([^|]+)/);
        const pulseMatch = vitalsStr.match(/Pulse:\s*([^\s|]+)/);
        const tolMatch = vitalsStr.match(/Tolerance:\s*([^|]+)/);
        const pathyaMatch = vitalsStr.match(/Pathya Advised:\s*([^|]+)/);

        setBp(bpMatch ? bpMatch[1].trim() : "");
        setPulse(pulseMatch ? pulseMatch[1].trim() : "");
        setTolerance(tolMatch ? tolMatch[1].trim() : "Well Tolerated (Samyak)");
        setPathyaAdvised(pathyaMatch ? pathyaMatch[1].trim().toLowerCase().startsWith("y") : true);

        const cleanNotes = rawNotes
          .replace(/\[Vitals:\s*[^\]]+\]\s*/, "")
          .replace(/Observations:\s*/, "");
        setNotes(cleanNotes.trim());
      } else {
        setBp("");
        setPulse("");
        setTolerance("Well Tolerated (Samyak)");
        setPathyaAdvised(true);
        setNotes(rawNotes);
      }
      setError("");
    }
  }, [session]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!session) return;
    try {
      setSaving(true);
      setError("");

      let finalNotes = notes.trim();
      const vitalsArr = [];
      if (bp.trim()) vitalsArr.push(`BP: ${bp.trim()}`);
      if (pulse.trim()) vitalsArr.push(`Pulse: ${pulse.trim()} bpm`);
      if (tolerance) vitalsArr.push(`Tolerance: ${tolerance}`);
      if (pathyaAdvised) vitalsArr.push(`Pathya Advised: Yes`);

      if (vitalsArr.length > 0) {
        const vitalsStr = `[Vitals: ${vitalsArr.join(" | ")}]`;
        finalNotes = finalNotes ? `${vitalsStr} ${finalNotes}` : vitalsStr;
      }

      await updateSessionStatus(session._id, {
        status,
        notes: finalNotes,
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Administer & Update Session">
      <div className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {/* Patient & Therapy Context Card */}
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-xs text-slate-500 block">Patient</span>
              <span className="font-semibold text-slate-900">
                {session?.therapyPlan?.patient?.fullName || "—"}
              </span>
              {session?.therapyPlan?.patient?.phone && (
                <span className="text-xs text-slate-500 block">
                  {session.therapyPlan.patient.phone}
                </span>
              )}
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Therapy Procedure</span>
              <span className="font-semibold text-slate-900">
                {session?.therapy?.name || "—"}
              </span>
              {session?.therapy?.category && (
                <span className="text-xs text-slate-500 uppercase block">
                  {session.therapy.category}
                </span>
              )}
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Scheduled Date</span>
              <span className="font-medium text-slate-700">
                {formatDate(session?.sessionDate)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Current Status</span>
              <span className="capitalize font-semibold text-slate-700">
                {session?.status || "scheduled"}
              </span>
            </div>
          </div>
        </div>

        {/* Outcome Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Session Outcome
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-slate-300 p-2.5 bg-white text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          >
            <option value="completed">Completed (Successfully Administered)</option>
            <option value="missed">Missed (Patient Did Not Attend)</option>
            <option value="cancelled">Cancelled (Contraindicated / Rescheduled)</option>
          </select>
        </div>

        {/* Clinical Vitals Section (Highlighted for completed sessions) */}
        {status === "completed" && (
          <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-800">
              <FaHeartbeat className="text-blue-600" />
              <span>Clinical Vitals & Lakshana (Observations)</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Blood Pressure (BP)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 120/80"
                  value={bp}
                  onChange={(e) => setBp(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm bg-white outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Pulse (bpm)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 72"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm bg-white outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Patient Tolerance (Samyak / Lakshana)
              </label>
              <select
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm bg-white outline-none focus:border-blue-600"
              >
                <option value="Well Tolerated (Samyak)">Well Tolerated (Samyak Yoga)</option>
                <option value="Mild Discomfort (Heena Yoga)">Mild Discomfort (Heena Yoga)</option>
                <option value="High Sensitivity (Atiyoga)">High Sensitivity / Intense (Atiyoga)</option>
                <option value="Normal / As Expected">Normal / As Expected</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={pathyaAdvised}
                onChange={(e) => setPathyaAdvised(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span className="text-xs font-medium text-slate-700">
                Advised post-procedure Pathya (warm water, light diet, rest)
              </span>
            </label>
          </div>
        )}

        {/* Freeform Notes */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Therapist Clinical Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            placeholder="Record procedure details, oils/medicines used, patient sensations, or recommendations for next session…"
            className="w-full rounded-lg border border-slate-300 p-2.5 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : "Save Session Update"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SessionModal;
