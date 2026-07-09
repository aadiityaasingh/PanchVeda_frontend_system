import DashboardLayout from "../../components/layout/DashboardLayout";

import PageHeader from "../../components/common/PageHeader";

import StatCard from "../../components/common/StatCard";

import {
  FaUsers,
  FaClipboardList,
  FaCalendarCheck,
  FaMoneyBillWave,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <PageHeader title="Dashboard" subtitle="Overview of Panchakarma center" />

      <div className="grid grid-cols-4 gap-6">
        <StatCard title="Patients" value="120" icon={<FaUsers />} />

        <StatCard title="Active Plans" value="35" icon={<FaClipboardList />} />

        <StatCard
          title="Today's Sessions"
          value="18"
          icon={<FaCalendarCheck />}
        />

        <StatCard
          title="Pending Bills"
          value="₹45K"
          icon={<FaMoneyBillWave />}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-xl font-bold mb-5">Recent Activity</h2>

        <div className="space-y-4">
          <p>Ravi Kumar completed Nasya Therapy</p>

          <p>New patient Priya Sharma registered</p>

          <p>₹5000 payment received</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
