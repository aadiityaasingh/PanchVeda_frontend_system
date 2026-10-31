import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import { getPatient, getPatientHistory } from "../../api/patientApi";
import { useAuth } from "../../context/AuthContext";
import { apiError, formatCurrency, formatDate } from "../../utils/formatters";
import {
  FaArrowLeft,
  FaCalendarPlus,
  FaNotesMedical,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

const PatientHistory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "doctor";

  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState({ plans: [], sessions: [], bills: [] });
  const [tab, setTab] = useState("plans");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([getPatient(id), getPatientHistory(id)])
      .then(([p, h]) => {
        setPatient(p.data);
        setHistory(h.data || { plans: [], sessions: [], bills: [] });
      })
      .catch((e) => setError(apiError(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const plansColumns = [
    {
      header: "Start Date",
      key: "startDate",
      render: (p) => formatDate(p.startDate),
    },
    {
      header: "End Date",
      key: "endDate",
      render: (p) => formatDate(p.endDate),
    },
    {
      header: "Therapies Prescribed",
      key: "therapies",
      render: (p) =>
        p.therapies?.map((t) => t.therapy?.name || "Therapy").join(", ") || "—",
    },
    {
      header: "Plan Status",
      key: "status",
      render: (p) => (
        <Badge
          variant={
            p.status === "completed"
              ? "success"
              : p.status === "ongoing"
              ? "info"
              : p.status === "planned"
              ? "warning"
              : "danger"
          }
        >
          {p.status?.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: "Action",
      key: "action",
      render: (p) => (
        <Button
          variant="outline"
          className="text-xs py-1 px-3"
          onClick={() => navigate(`/plans/${p._id}`)}
        >
          View Plan
        </Button>
      ),
    },
  ];

  const sessionsColumns = [
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
      header: "Clinical Notes",
      key: "notes",
      render: (s) => s.notes || <em className="text-slate-400">None</em>,
    },
  ];

  const billsColumns = [
    {
      header: "Invoice Date",
      key: "createdAt",
      render: (b) => formatDate(b.createdAt),
    },
    {
      header: "Total Invoiced",
      key: "totalAmount",
      render: (b) => (
        <span className="font-bold text-slate-900">
          {formatCurrency(b.totalAmount)}
        </span>
      ),
    },
    {
      header: "Paid Amount",
      key: "paidAmount",
      render: (b) => (
        <span className="font-bold text-emerald-700">
          {formatCurrency(b.paidAmount)}
        </span>
      ),
    },
    {
      header: "Outstanding Balance",
      key: "balance",
      render: (b) => {
        const bal = (b.totalAmount || 0) - (b.paidAmount || 0);
        return (
          <span
            className={`font-bold ${
              bal > 0 ? "text-amber-600" : "text-slate-400"
            }`}
          >
            {formatCurrency(bal)}
          </span>
        );
      },
    },
    {
      header: "Status",
      key: "status",
      render: (b) => (
        <Badge
          variant={
            b.status === "paid"
              ? "success"
              : b.status === "partial"
              ? "warning"
              : "danger"
          }
        >
          {b.status?.toUpperCase()}
        </Badge>
      ),
    },
  ];

  const tabs = [
    { key: "plans", label: `Therapy Plans (${history.plans?.length || 0})` },
    {
      key: "sessions",
      label: `Session Log (${history.sessions?.length || 0})`,
    },
    ...(canManage
      ? [{ key: "bills", label: `Invoices (${history.bills?.length || 0})` }]
      : []),
  ];

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

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Patient Profile Card */}
      {patient && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white font-bold text-xl flex items-center justify-center shadow-md">
                {patient.fullName?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {patient.fullName}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                  <span className="capitalize">{patient.gender}</span>
                  <span>·</span>
                  <span>Born: {formatDate(patient.dateOfBirth)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <FaPhoneAlt className="text-xs" /> {patient.phone}
                  </span>
                </div>
              </div>
            </div>

            {canManage && (
              <Button
                onClick={() => navigate(`/plans/add?patientId=${patient._id}`)}
                className="flex items-center gap-2"
              >
                <FaCalendarPlus /> Create Treatment Plan
              </Button>
            )}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {patient.address && (
              <div className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-slate-400 mt-1" />
                <div>
                  <span className="text-xs text-slate-400 block uppercase font-medium">
                    Address
                  </span>
                  <span className="text-slate-700">{patient.address}</span>
                </div>
              </div>
            )}

            {patient.emergencyContact?.name && (
              <div>
                <span className="text-xs text-slate-400 block uppercase font-medium">
                  Emergency Contact
                </span>
                <span className="text-slate-700 font-medium">
                  {patient.emergencyContact.name}{" "}
                  {patient.emergencyContact.phone &&
                    `(${patient.emergencyContact.phone})`}
                </span>
              </div>
            )}

            {patient.medicalNotes && (
              <div className="sm:col-span-2">
                <span className="text-xs text-slate-400 block uppercase font-medium flex items-center gap-1">
                  <FaNotesMedical /> Medical Notes & Prakriti
                </span>
                <p className="text-slate-700 mt-0.5 whitespace-pre-wrap">
                  {patient.medicalNotes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 mb-6">
        {tabs.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`px-5 py-3 font-semibold text-sm transition-all border-b-2 -mb-px ${
              tab === item.key
                ? "border-emerald-600 text-emerald-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div>
        {tab === "plans" && (
          <Table
            columns={plansColumns}
            data={history.plans}
            emptyMessage={
              loading ? "Loading plans…" : "No therapy plans created yet for this patient."
            }
          />
        )}
        {tab === "sessions" && (
          <Table
            columns={sessionsColumns}
            data={history.sessions}
            emptyMessage={
              loading ? "Loading sessions…" : "No sessions logged for this patient."
            }
          />
        )}
        {tab === "bills" && canManage && (
          <Table
            columns={billsColumns}
            data={history.bills}
            emptyMessage={
              loading ? "Loading bills…" : "No invoices generated yet for this patient."
            }
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientHistory;
