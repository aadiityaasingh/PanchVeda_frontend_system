import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import {
  FaMoneyBillWave,
  FaUsers,
  FaCheckCircle,
  FaExclamationCircle,
  FaChartLine,
  FaPrint,
  FaSyncAlt,
} from "react-icons/fa";
import {
  getRevenueReport,
  getPatientStats,
  getTopTherapies,
} from "../../api/reportApi";
import { apiError, formatCurrency } from "../../utils/formatters";

const Reports = () => {
  const [revenue, setRevenue] = useState(null);
  const [patientStats, setPatientStats] = useState(null);
  const [topTherapies, setTopTherapies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [revRes, patRes, topRes] = await Promise.all([
        getRevenueReport(),
        getPatientStats(),
        getTopTherapies(),
      ]);

      setRevenue(revRes.data);
      setPatientStats(patRes.data);
      setTopTherapies(topRes.data || []);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const collectionRate =
    revenue && revenue.totalRevenue > 0
      ? Math.round((revenue.totalPaid / revenue.totalRevenue) * 100)
      : 0;

  return (
    <DashboardLayout>
      <PageHeader
        title="Reports & Analytics"
        subtitle="Financial summary and therapy utilization insights"
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 text-sm"
            >
              <FaSyncAlt className={loading ? "animate-spin" : ""} /> Refresh
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.print()}
              className="flex items-center gap-2 text-sm"
            >
              <FaPrint /> Print Report
            </Button>
          </div>
        }
      />

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatCard
          title="Total Billed Revenue"
          value={revenue ? formatCurrency(revenue.totalRevenue) : "—"}
          icon={<FaMoneyBillWave className="text-blue-600" />}
        />
        <StatCard
          title="Payments Collected"
          value={revenue ? formatCurrency(revenue.totalPaid) : "—"}
          icon={<FaCheckCircle className="text-emerald-600" />}
        />
        <StatCard
          title="Outstanding Dues"
          value={revenue ? formatCurrency(revenue.totalUnpaid) : "—"}
          icon={<FaExclamationCircle className="text-amber-600" />}
        />
        <StatCard
          title="Total Patients"
          value={patientStats ? patientStats.totalPatients : "—"}
          icon={<FaUsers className="text-purple-600" />}
        />
      </div>

      {/* Revenue Breakdown Progress Card */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FaChartLine className="text-blue-600" /> Collection Performance
            </h2>
            <p className="text-sm text-slate-500">
              Ratio of collected payments to total invoiced treatment fees
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-slate-900">
              {collectionRate}%
            </span>
            <span className="text-sm text-slate-500 block">collected</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex">
          <div
            className="bg-emerald-600 h-full transition-all duration-500"
            style={{ width: `${collectionRate}%` }}
            title={`Paid: ${collectionRate}%`}
          />
          <div
            className="bg-amber-500 h-full transition-all duration-500"
            style={{ width: `${100 - collectionRate}%` }}
            title={`Outstanding: ${100 - collectionRate}%`}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span className="text-slate-600 font-medium">Collected:</span>
            <span className="font-bold text-slate-900">
              {revenue ? formatCurrency(revenue.totalPaid) : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600 font-medium">Pending:</span>
            <span className="font-bold text-slate-900">
              {revenue ? formatCurrency(revenue.totalUnpaid) : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Top Prescribed Therapies */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Most Prescribed Therapies
          </h2>
          <p className="text-sm text-slate-500">
            Top therapies incorporated in active and completed patient treatment plans
          </p>
        </div>

        {topTherapies.length === 0 ? (
          <p className="text-slate-500 text-sm py-4">
            No therapy plan data recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Therapy Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Plans Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {topTherapies.map((item, index) => (
                  <tr key={item._id || index} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-400">
                      #{index + 1}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {item.name || "Therapy"}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="info">
                        {item.category?.toUpperCase() || "AYURVEDIC"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">
                      {item.count} plans
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
