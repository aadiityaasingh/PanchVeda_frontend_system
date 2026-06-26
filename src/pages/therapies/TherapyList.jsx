import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import therapyData from "../../assets/therapyData";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";

const TherapyList = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <PageHeader
        title="Therapies"
        subtitle="Manage available therapies"
        action={
          <Button onClick={() => navigate("/therapies/add")}>
            + Add Therapy
          </Button>
        }
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Duration</th>
              <th className="p-4 text-left">Cost</th>
            </tr>
          </thead>

          <tbody>
            {therapyData.map((therapy) => (
              <tr key={therapy.id} className="border-t">
                <td className="p-4">{therapy.name}</td>
                <td className="p-4">{therapy.category}</td>
                <td className="p-4">{therapy.duration} Days</td>
                <td className="p-4">₹{therapy.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default TherapyList;
