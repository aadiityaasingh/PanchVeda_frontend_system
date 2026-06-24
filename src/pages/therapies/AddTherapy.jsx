import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const AddTherapy = () => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    duration: "",
    cost: "",
    description: "",
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

    alert("Therapy Added");
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Add Therapy
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Therapy Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        >
          <option value="">Select Category</option>
          <option value="vamana">Vamana</option>
          <option value="virechana">Virechana</option>
          <option value="basti">Basti</option>
          <option value="nasya">Nasya</option>
          <option value="raktamokshana">
            Raktamokshana
          </option>
        </select>

        <input
          type="number"
          name="duration"
          placeholder="Duration Days"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="number"
          name="cost"
          placeholder="Base Cost"
          value={formData.cost}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded-lg"
        />

        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Save Therapy
        </button>
      </form>
    </DashboardLayout>
  );
};

export default AddTherapy;