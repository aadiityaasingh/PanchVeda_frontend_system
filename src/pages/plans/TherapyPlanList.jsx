import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";

const TherapyPlanList = () => {
  const navigate = useNavigate();

  const therapyPlans = [
    {
      id: 1,
      patient: "Ravi Kumar",
      startDate: "2026-06-24",
      endDate: "2026-06-30",
      status: "Active",
    },
    {
      id: 2,
      patient: "Priya Sharma",
      startDate: "2026-06-20",
      endDate: "2026-06-27",
      status: "Completed",
    },
  ];

  const columns = [
    {
      header: "Patient",
      key: "patient",
    },
    {
      header: "Start Date",
      key: "startDate",
    },
    {
      header: "End Date",
      key: "endDate",
    },
    {
      header: "Status",
      key: "status",
    },
    {
      header: "Action",
      key: "action",
      render: () => (
        <Button variant="outline">
          View
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>

      <PageHeader
        title="Therapy Plans"
        subtitle="Manage therapy plans"
        action={
          <Button
            onClick={() => navigate("/plans/add")}
          >
            + Create Therapy Plan
          </Button>
        }
      />

      <Table
        columns={columns}
        data={therapyPlans}
      />

    </DashboardLayout>
  );
};

export default TherapyPlanList;