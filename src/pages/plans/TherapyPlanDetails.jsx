import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Badge from "../../components/common/Badge";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import SessionModal from "../../components/sessions/SessionModal";
import { getTherapyPlan } from "../../api/therapyPlanApi";
import { getPlanSessions, updateSessionStatus } from "../../api/sessionApi";
import { getBillByPlan, addPayment } from "../../api/billApi";
import { useAuth } from "../../context/AuthContext";
import { apiError, formatCurrency, formatDate } from "../../utils/formatters";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaMoneyBillWave,
  FaNotesMedical,
  FaCalendarAlt,
} from "react-icons/fa";

const TherapyPlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canViewBilling = user?.role === "admin" || user?.role === "doctor";

  const [plan, setPlan] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [bill, setBill] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Session update modal
  const [selectedSession, setSelectedSession] = useState(null);

  // Payment modal
  const [payModal, setPayModal] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [savingPayment, setSavingPayment] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const requests = [
        getTherapyPlan(id),
        getPlanSessions(id),
      ];
      if (canViewBilling) {
        requests.push(getBillByPlan(id).catch(() => ({ data: null })));
      }

      const [pRes, sRes, bRes] = await Promise.all(requests);

      setPlan(pRes.data);
      setSessions(sRes.data || []);
      if (bRes) setBill(bRes.data);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, canViewBilling]);

  // Session progress calculation
  const progress = useMemo(() => {
    if (!sessions.length) return { completed: 0, total: 0, percentage: 0 };
    const completed = sessions.filter((s) => s.status === "completed").length;
    return {
      completed,
      total: sessions.length,
      percentage: Math.round((completed / sessions.length) * 100),
    };
  }, [sessions]);



  const handleAddPayment = async () => {
    if (!bill) return;
    try {
      setSavingPayment(true);
      setError("");
      setSuccess("");
      await addPayment(bill._id, payAmount);
      setSuccess(`Payment of ${formatCurrency(payAmount)} received.`);
      setPayModal(false);
      setPayAmount("");
      loadData();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSavingPayment(false);
    }
  };

  const sessionColumns = [
    {
      header: "Therapy",
      key: "therapy",
      render: (s) => (
        <div>
          <span className="font-semibold text-slate-800">
            {s.therapy?.name || "—"}
          </span>
          {s.therapy?.category && (
            <span className="block text-xs text-slate-500 capitalize">
              {s.therapy.category}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Session Date",
      key: "sessionDate",
      render: (s) => formatDate(s.sessionDate),
    },
    {
      header: "Status",
      key: "status",
      render: (s) => (
        <Badge
          variant={
            s.status === "completed"
              ? "success"
              : s.status === "scheduled"
              ? "warning"
              : "danger"
          }
        >
          {s.status?.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: "Therapist Notes",
      key: "notes",
      render: (s) => s.notes || <em className="text-slate-400">None</em>,
    },
    {
      header: "Action",
      key: "action",
      render: (s) => (
        <Button
          variant="outline"
          className="text-xs py-1 px-3"
          onClick={() => setSelectedSession(s)}
        >
          {s.status === "scheduled" ? "Update / Vitals" : "Edit Notes"}
        </Button>
      ),
    },
  ];

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

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200">
          {success}
        </div>
      )}

      {plan && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Therapy Plan Details
                </span>
                <h1 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {plan.patient?.fullName}
                </h1>
                <p className="mt-1 text-sm text-slate-500 flex items-center gap-2">
                  <FaCalendarAlt className="text-emerald-600" />
                  {formatDate(plan.startDate)} – {formatDate(plan.endDate)}
                </p>
              </div>

              <div className="text-right">
                <Badge
                  variant={
                    plan.status === "completed"
                      ? "success"
                      : plan.status === "ongoing"
                      ? "info"
                      : "warning"
                  }
                >
                  {plan.status?.toUpperCase()}
                </Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-5">
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                <span>Treatment Regimen Progress</span>
                <span>
                  {progress.completed} of {progress.total} sessions completed (
                  {progress.percentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>

            {/* Prescribed therapies grid */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Prescribed Therapies & Durations
              </h3>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {plan.therapies?.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="font-bold text-slate-900">
                      {item.therapy?.name}
                    </p>
                    <p className="text-xs text-slate-500 capitalize">
                      Category: {item.therapy?.category || "Panchakarma"}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs border-t border-slate-200 pt-2 font-medium">
                      <span className="text-slate-600">
                        {item.durationDays} Days Duration
                      </span>
                      {canViewBilling && (
                        <span className="text-emerald-700 font-bold">
                          {formatCurrency(item.costPerDay)}/day
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {plan.notes && (
              <div className="mt-5 rounded-xl bg-amber-50/50 p-4 border border-amber-200 text-sm">
                <span className="text-xs font-bold uppercase text-amber-800 flex items-center gap-1">
                  <FaNotesMedical /> Doctor's Clinical Directives & Diet (Pathya)
                </span>
                <p className="mt-1 text-slate-700 whitespace-pre-wrap">
                  {plan.notes}
                </p>
              </div>
            )}
          </div>

          {/* Sessions Section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                Scheduled Daily Sessions ({sessions.length})
              </h2>
            </div>
            <Table
              columns={sessionColumns}
              data={sessions}
              emptyMessage="No sessions generated for this plan."
            />
          </div>

          {/* Billing & Invoice Summary: Only shown to Admin and Doctor */}
          {canViewBilling && bill && (
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FaMoneyBillWave className="text-emerald-600" /> Plan Billing
                    Summary
                  </h2>
                  <p className="text-xs text-slate-500">
                    Auto-generated invoice for this therapy package
                  </p>
                </div>
                <Badge
                  variant={
                    bill.status === "paid"
                      ? "success"
                      : bill.status === "partial"
                      ? "warning"
                      : "danger"
                  }
                >
                  {bill.status?.toUpperCase()}
                </Badge>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                  <span className="text-xs text-slate-500 block uppercase font-medium">
                    Total Invoiced
                  </span>
                  <span className="text-2xl font-bold text-slate-900">
                    {formatCurrency(bill.totalAmount)}
                  </span>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200">
                  <span className="text-xs text-emerald-700 block uppercase font-medium">
                    Total Paid
                  </span>
                  <span className="text-2xl font-bold text-emerald-800">
                    {formatCurrency(bill.paidAmount)}
                  </span>
                </div>
                <div className="rounded-xl bg-amber-50 p-4 border border-amber-200">
                  <span className="text-xs text-amber-700 block uppercase font-medium">
                    Remaining Due
                  </span>
                  <span className="text-2xl font-bold text-amber-800">
                    {formatCurrency(bill.totalAmount - bill.paidAmount)}
                  </span>
                </div>
              </div>

              {user?.role === "admin" && bill.status !== "paid" && (
                <div className="mt-5 flex justify-end">
                  <Button
                    onClick={() => {
                      setPayAmount(String(bill.totalAmount - bill.paidAmount));
                      setPayModal(true);
                    }}
                  >
                    Collect / Record Payment
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Session Status & Clinical Vitals Modal */}
          <SessionModal
            isOpen={Boolean(selectedSession)}
            onClose={() => setSelectedSession(null)}
            session={
              selectedSession
                ? {
                    ...selectedSession,
                    therapyPlan: selectedSession.therapyPlan || {
                      patient: plan?.patient,
                    },
                  }
                : null
            }
            onSuccess={() => {
              setSuccess("Session record & vitals updated successfully.");
              loadData();
            }}
          />

          {/* Payment Modal */}
          {canViewBilling && (
            <Modal
              isOpen={payModal}
              onClose={() => setPayModal(false)}
              title="Record Plan Payment"
            >
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Outstanding Balance:{" "}
                  <strong>
                    {bill && formatCurrency(bill.totalAmount - bill.paidAmount)}
                  </strong>
                </p>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Payment Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={bill ? bill.totalAmount - bill.paidAmount : undefined}
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 p-3 text-lg font-bold outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPayModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddPayment}
                    disabled={savingPayment || !payAmount || Number(payAmount) <= 0}
                  >
                    {savingPayment ? "Saving…" : "Confirm Payment"}
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default TherapyPlanDetails;
