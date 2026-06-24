import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import therapyData from "../../assets/therapyData";

const TherapyList = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Therapies
        </h1>

        <button
          onClick={() => navigate("/therapies/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Therapy
        </button>
      </div>

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
                <td className="p-4">
                  {therapy.duration} Days
                </td>
                <td className="p-4">
                  ₹{therapy.cost}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default TherapyList;