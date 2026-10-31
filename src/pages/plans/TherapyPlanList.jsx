import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import { getTherapyPlans } from "../../api/therapyPlanApi";
import { useAuth } from "../../context/AuthContext";
import { apiError, formatDate } from "../../utils/formatters";
import { FaPlus, FaFilter } from "react-icons/fa";

const TherapyPlanList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canCreate = user?.role === "admin" || user?.role === "doctor";

  const [plans, setPlans] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError("");
      const params = { limit: 100 };
      if (statusFilter !== "all") params.status = statusFilter;
      const r = await getTherapyPlans(params);
      setPlans(r.data || []);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [statusFilter]);

  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      const patientName = p.patient?.fullName?.toLowerCase() || "";
      const matchesSearch = patientName.includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [plans, search]);

  const statusVariant = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "ongoing":
        return "info";
      case "planned":
        return "warning";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const columns = [
    {
      header: "Patient",
      key: "patient",
      render: (p) => (
        <div>
          <div className="font-bold text-slate-900">
            {p.patient?.fullName || "—"}
          </div>
          <div className="text-xs text-slate-500">{p.patient?.phone || ""}</div>
        </div>
      ),
    },
    {
      header: "Therapies Prescribed",
      key: "therapies",
      render: (p) => (
        <div className="flex flex-wrap gap-1 max-w-xs">
          {p.therapies?.map((item, idx) => (
            <span
              key={idx}
              className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
            >
              {item.therapy?.name || "Therapy"} ({item.durationDays}d)
            </span>
          ))}
        </div>
      ),
    },
    {
      header: "Schedule Period",
      key: "dates",
      render: (p) => (
        <span className="text-sm text-slate-700">
          {formatDate(p.startDate)} – {formatDate(p.endDate)}
        </span>
      ),
    },
    {
      header: "Plan Status",
      key: "status",
      render: (p) => (
        <Badge variant={statusVariant(p.status)}>
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
          View Details
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Therapy Treatment Plans"
        subtitle={
          canCreate
            ? "Manage active, planned, and completed multi-day clinical regimens"
            : "Review prescribed Panchakarma regimens, doctor instructions, and schedule status"
        }
        action={
          canCreate ? (
            <Button
              onClick={() => navigate("/plans/add")}
              className="flex items-center gap-2"
            >
              <FaPlus /> Create Therapy Plan
            </Button>
          ) : null
        }
      />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Search and Status Filter */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search plans by patient name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600 font-medium flex items-center gap-1.5">
            <FaFilter className="text-slate-400" /> Status:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All plans</option>
            <option value="planned">Planned</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredPlans}
        emptyMessage={
          loading ? "Loading therapy plans…" : "No therapy plans found matching filter."
        }
      />
    </DashboardLayout>
  );
};

export default TherapyPlanList;
