import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

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
      <h1 className="text-3xl font-bold mb-6">
        Add Patient
      </h1>

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

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

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