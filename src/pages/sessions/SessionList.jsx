import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";
import SessionModal from "../../components/sessions/SessionModal";
import { getSessions } from "../../api/sessionApi";
import { useAuth } from "../../context/AuthContext";
import { apiError, formatDate } from "../../utils/formatters";
import { FaFilter, FaCalendarAlt, FaTimes } from "react-icons/fa";

const SessionList = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [date, setDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const params = {};
      if (date) params.date = date;
      const r = await getSessions(params);
      setSessions(r.data || []);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [date]);

  const setToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    setDate(today);
  };

  const clearDate = () => {
    setDate("");
  };

  const filteredSessions = useMemo(() => {
    if (statusFilter === "all") return sessions;
    return sessions.filter((s) => s.status === statusFilter);
  }, [sessions, statusFilter]);

  const canUpdate = ["admin", "doctor", "therapist"].includes(user?.role);

  const columns = [
    {
      header: "Patient",
      key: "patient",
      render: (s) => (
        <div>
          <div className="font-semibold text-slate-900">
            {s.therapyPlan?.patient?.fullName || "—"}
          </div>
          <div className="text-xs text-slate-500">
            {s.therapyPlan?.patient?.phone || ""}
          </div>
        </div>
      ),
    },
    {
      header: "Therapy",
      key: "therapy",
      render: (s) => (
        <div>
          <span className="font-medium text-slate-800">
            {s.therapy?.name || "—"}
          </span>
          {s.therapy?.category && (
            <span className="block text-xs text-slate-500 uppercase">
              {s.therapy.category}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Date",
      key: "sessionDate",
      render: (s) => (
        <span className="font-medium text-slate-700">
          {formatDate(s.sessionDate)}
        </span>
      ),
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
      header: "Clinical Notes & Vitals",
      key: "notes",
      render: (s) => (
        <span className="text-xs text-slate-600 max-w-sm truncate block">
          {s.notes || <em className="text-slate-400">No notes recorded</em>}
        </span>
      ),
    },
    ...(canUpdate
      ? [
          {
            header: "Action",
            key: "action",
            render: (s) => (
              <Button
                variant="outline"
                className="text-xs py-1 px-3"
                onClick={() => setSelected(s)}
              >
                {s.status === "scheduled" ? "Administer" : "Edit / Vitals"}
              </Button>
            ),
          },
        ]
      : []),
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Therapy Sessions"
        subtitle={
          user?.role === "therapist"
            ? "Track treatments, record patient vitals & tolerance, and log session outcomes"
            : "Track and update daily patient therapy administrations"
        }
      />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200">
          {success}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 flex flex-wrap items-center justify-between gap-4">
        {/* Date Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <FaCalendarAlt className="text-blue-600" /> Filter by Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm outline-none focus:border-blue-500"
          />
          <button
            onClick={setToday}
            className="rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition"
          >
            Today
          </button>
          {date && (
            <button
              onClick={clearDate}
              className="rounded-lg bg-red-50 hover:bg-red-100 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition flex items-center gap-1"
            >
              <FaTimes /> Clear Date
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
            <FaFilter className="text-slate-500" /> Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm bg-white outline-none focus:border-blue-500"
          >
            <option value="all">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredSessions}
        emptyMessage={
          loading
            ? "Loading sessions…"
            : "No sessions found matching the specified date and status filters."
        }
      />

      {/* Modal for updating session and recording vitals */}
      <SessionModal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        session={selected}
        onSuccess={() => {
          setSuccess("Session record & vitals updated successfully.");
          load();
        }}
      />
    </DashboardLayout>
  );
};

export default SessionList;
