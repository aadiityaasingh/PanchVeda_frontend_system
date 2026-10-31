import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarCheck,
  FaMoneyBillWave,
  FaUsers,
  FaPlus,
  FaClipboardList,
  FaHeartbeat,
  FaChartBar,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaBookMedical,
  FaUserInjured,
} from "react-icons/fa";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import SessionModal from "../../components/sessions/SessionModal";
import { getPatientStats, getRevenueReport, getTopTherapies } from "../../api/reportApi";
import { getSessions } from "../../api/sessionApi";
import { useAuth } from "../../context/AuthContext";
import { apiError, formatCurrency, formatDate } from "../../utils/formatters";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    patients: "—",
    paid: "—",
    unpaid: "—",
    sessionsToday: "—",
    completedToday: 0,
    scheduledToday: 0,
    missedToday: 0,
  });
  const [todaySessions, setTodaySessions] = useState([]);
  const [topTherapies, setTopTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal for quick status update
  const [selectedSession, setSelectedSession] = useState(null);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const todayStr = new Date().toISOString().slice(0, 10);
      const sessionReq = getSessions({ date: todayStr });

      let patientRes = null;
      let revenueRes = null;
      let topRes = null;

      if (user?.role === "admin" || user?.role === "doctor") {
        patientRes = await getPatientStats().catch(() => null);
      }

      if (user?.role === "admin") {
        revenueRes = await getRevenueReport().catch(() => null);
        topRes = await getTopTherapies().catch(() => null);
      }

      const sessionsRes = await sessionReq;
      const sessions = sessionsRes.data || [];
      setTodaySessions(sessions);

      const totalToday = sessions.length;
      const completedToday = sessions.filter((s) => s.status === "completed").length;
      const scheduledToday = sessions.filter((s) => s.status === "scheduled").length;
      const missedToday = sessions.filter((s) => s.status === "missed" || s.status === "cancelled").length;

      setStats({
        sessionsToday: totalToday,
        completedToday,
        scheduledToday,
        missedToday,
        patients: patientRes?.data?.totalPatients ?? "—",
        paid: revenueRes?.data ? formatCurrency(revenueRes.data.totalPaid) : "—",
        unpaid: revenueRes?.data ? formatCurrency(revenueRes.data.totalUnpaid) : "—",
      });

      if (topRes?.data) {
        setTopTherapies(topRes.data.slice(0, 4));
      }
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user?.role]);

  const sessionColumns = [
    {
      header: "Patient",
      key: "patient",
      render: (s) => (
        <div>
          <span className="font-semibold text-slate-800 block">
            {s.therapyPlan?.patient?.fullName || "—"}
          </span>
          {s.therapyPlan?.patient?.phone && (
            <span className="text-xs text-slate-500">
              {s.therapyPlan.patient.phone}
            </span>
          )}
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
            <span className="text-xs text-slate-500 block uppercase">
              {s.therapy.category}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Date",
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
          {s.status}
        </Badge>
      ),
    },
    {
      header: "Clinical Notes",
      key: "notes",
      render: (s) => (
        <span className="text-xs text-slate-600 max-w-xs truncate block">
          {s.notes || <em className="text-slate-400">None</em>}
        </span>
      ),
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
          {s.status === "scheduled"
            ? user?.role === "therapist"
              ? "Administer"
              : "Update"
            : "Edit Notes"}
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title={user?.role === "therapist" ? "Therapist Treatment Center" : "Dashboard"}
        subtitle={
          user?.role === "therapist"
            ? `Welcome, ${user?.fullName || "Therapist"}. Here is your clinical queue and treatment schedule for today.`
            : `Welcome back, ${user?.fullName || "Staff Member"}. Here is your clinic overview.`
        }
      />

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Quick Action Shortcuts */}
      <div className="mb-8 flex flex-wrap gap-3">
        {user?.role === "therapist" && (
          <>
            <button
              onClick={() => navigate("/sessions")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <FaCalendarCheck /> All Sessions Queue
            </button>
            <button
              onClick={() => navigate("/patients")}
              className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-700 transition"
            >
              <FaUserInjured /> Patient Medical Records
            </button>
            <button
              onClick={() => navigate("/therapies")}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <FaBookMedical /> Panchakarma Protocols
            </button>
            <button
              onClick={() => navigate("/plans")}
              className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-900 transition"
            >
              <FaClipboardList /> Active Therapy Plans
            </button>
          </>
        )}

        {(user?.role === "admin" || user?.role === "doctor") && (
          <>
            <button
              onClick={() => navigate("/patients/add")}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              <FaPlus className="text-xs" /> New Patient
            </button>
            <button
              onClick={() => navigate("/plans/add")}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <FaClipboardList /> Create Therapy Plan
            </button>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <button
              onClick={() => navigate("/therapies/add")}
              className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-900 transition"
            >
              <FaHeartbeat /> Add Therapy
            </button>
            <button
              onClick={() => navigate("/reports")}
              className="flex items-center gap-2 rounded-xl bg-purple-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-purple-800 transition"
            >
              <FaChartBar /> View Reports
            </button>
          </>
        )}
      </div>

      {/* Stats Cards Grid */}
      {user?.role === "therapist" ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Assigned Today"
            value={stats.sessionsToday}
            icon={<FaCalendarCheck className="text-blue-600" />}
          />
          <StatCard
            title="Completed"
            value={stats.completedToday}
            icon={<FaCheckCircle className="text-emerald-600" />}
          />
          <StatCard
            title="In Queue / Scheduled"
            value={stats.scheduledToday}
            icon={<FaClock className="text-amber-500" />}
          />
          <StatCard
            title="Missed / Cancelled"
            value={stats.missedToday}
            icon={<FaTimesCircle className="text-red-500" />}
          />
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Today's Sessions"
            value={stats.sessionsToday}
            icon={<FaCalendarCheck className="text-blue-600" />}
          />

          {(user?.role === "admin" || user?.role === "doctor") && (
            <StatCard
              title="Registered Patients"
              value={stats.patients}
              icon={<FaUsers className="text-purple-600" />}
            />
          )}

          {user?.role === "admin" && (
            <>
              <StatCard
                title="Payments Collected"
                value={stats.paid}
                icon={<FaMoneyBillWave className="text-emerald-600" />}
              />
              <StatCard
                title="Outstanding Balance"
                value={stats.unpaid}
                icon={<FaMoneyBillWave className="text-amber-600" />}
              />
            </>
          )}
        </div>
      )}

      {/* Today's Schedule Table */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {user?.role === "therapist" ? "Today's Clinical Treatment Queue" : "Today's Therapy Sessions"}
            </h2>
            <p className="text-sm text-slate-500">
              {user?.role === "therapist"
                ? `Active patients scheduled for Panchakarma therapies today (${formatDate(new Date().toISOString())})`
                : `Patients scheduled for treatment today (${formatDate(new Date().toISOString())})`}
            </p>
          </div>
          <Button
            variant="outline"
            className="text-xs"
            onClick={() => navigate("/sessions")}
          >
            All Sessions →
          </Button>
        </div>

        <Table
          columns={sessionColumns}
          data={todaySessions}
          emptyMessage="No therapy sessions scheduled for today."
        />
      </div>

      {/* Top Therapies Widget (Admin only) */}
      {user?.role === "admin" && topTherapies.length > 0 && (
        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Top Prescribed Therapies
            </h2>
            <Button
              variant="outline"
              className="text-xs"
              onClick={() => navigate("/reports")}
            >
              Full Analytics →
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {topTherapies.map((t, idx) => (
              <div
                key={t._id || idx}
                className="rounded-lg border border-slate-200 p-4 bg-slate-50 flex flex-col justify-between"
              >
                <div>
                  <Badge variant="info">{t.category?.toUpperCase() || "AYURVEDA"}</Badge>
                  <h3 className="mt-2 font-bold text-slate-800">{t.name}</h3>
                </div>
                <p className="mt-3 text-sm text-emerald-700 font-semibold">
                  {t.count} Treatment Plans
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Session Status & Clinical Vitals Update Modal */}
      <SessionModal
        isOpen={Boolean(selectedSession)}
        onClose={() => setSelectedSession(null)}
        session={selectedSession}
        onSuccess={loadDashboard}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
