import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Select from "../../components/common/Select";

const AddPatient = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalNotes: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Patient Created Successfully");
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">Add Patient</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={[
            {
              value: "male",
              label: "Male",
            },
            {
              value: "female",
              label: "Female",
            },
            {
              value: "other",
              label: "Other",
            },
          ]}
        />

        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="emergencyContactName"
          placeholder="Emergency Contact Name"
          value={formData.emergencyContactName}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="text"
          name="emergencyContactPhone"
          placeholder="Emergency Contact Phone"
          value={formData.emergencyContactPhone}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          name="medicalNotes"
          placeholder="Medical Notes"
          value={formData.medicalNotes}
          onChange={handleChange}
          rows="4"
          className="w-full border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Save Patient
        </button>
      </form>
    </DashboardLayout>
  );
};

export default AddPatient;
