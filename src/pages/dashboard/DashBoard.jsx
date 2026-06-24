import DashboardLayout from "../../components/layout/DashboardLayout";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">
        Panchakarma Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Welcome to the management system.
      </p>
    </DashboardLayout>
  );
};

export default Dashboard;