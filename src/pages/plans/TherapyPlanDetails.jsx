import DashboardLayout from "../../components/layout/DashboardLayout";

import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";

const TherapyPlanDetails = () => {
  const sessions = [
    {
      id: 1,
      therapy: "Nasya",
      date: "2026-06-24",
      status: "Completed",
    },
    {
      id: 2,
      therapy: "Vamana",
      date: "2026-06-25",
      status: "Scheduled",
    },
  ];

  const columns = [
    {
      header: "Therapy",
      key: "therapy",
    },

    {
      header: "Date",
      key: "date",
    },

    {
      header: "Status",
      key: "status",
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Therapy Plan Details"
        subtitle="Patient treatment information"
      />

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold">Ravi Kumar</h2>

        <p>24 Jun 2026 - 30 Jun 2026</p>

        <p className="mt-2">Status: Active</p>
      </div>

      <h2 className="text-xl font-bold mb-4">Sessions</h2>

      <Table columns={columns} data={sessions} />

      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="text-xl font-bold mb-3">Bill Summary</h2>

        <p>Total: ₹10000</p>

        <p>Paid: ₹5000</p>

        <p>Balance: ₹5000</p>
      </div>
    </DashboardLayout>
  );
};

export default TherapyPlanDetails;
