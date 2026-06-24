import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

import patientData from "../../assets/patientData";

const PatientList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredPatients = patientData.filter((patient) =>
    patient.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Patients</h1>

        <button
          onClick={() => navigate("/patients/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Add Patient
        </button>
      </div>

      <input
        type="text"
        placeholder="Search Patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 border rounded-lg mb-6"
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Name</th>

              <th className="p-4 text-left">Gender</th>

              <th className="p-4 text-left">Phone</th>

              <th className="p-4 text-left">DOB</th>

              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="border-t">
                <td className="p-4">{patient.fullName}</td>

                <td className="p-4">{patient.gender}</td>

                <td className="p-4">{patient.phone}</td>

                <td className="p-4">{patient.dob}</td>

                <td className="p-4">
                  <button
                    onClick={() => navigate(`/patients/${patient.id}`)}
                    className="text-blue-600"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default PatientList;
