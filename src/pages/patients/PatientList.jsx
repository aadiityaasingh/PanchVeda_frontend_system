import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

import patientData from "../../assets/patientData";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";

const PatientList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const filteredPatients = patientData.filter((patient) =>
    patient.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  const columns = [
    {
      header: "Name",
      key: "fullName",
    },
    {
      header: "Gender",
      key: "gender",
    },
    {
      header: "Phone",
      key: "phone",
    },
    {
      header: "DOB",
      key: "dob",
    },
    {
      header: "Action",
      key: "action",
      render: (patient) => (
        <Button
          variant="outline"
          onClick={() => navigate(`/patients/${patient.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Patients"
        subtitle="Manage all registered patients"
        action={
          <Button onClick={() => setOpenModal(true)}>+ Add Patient</Button>
        }
      />

      <Input
        placeholder="Search Patient..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <Modal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          title="Add Patient"
        >
          <p className="mb-4">Our Add Patient form will come here later.</p>

          <Button variant="danger" onClick={() => setOpenModal(false)}>
            Close
          </Button>
        </Modal>
        <Table columns={columns} data={filteredPatients} />
      </div>
    </DashboardLayout>
  );
};

export default PatientList;
