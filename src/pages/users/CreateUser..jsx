import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Badge from "../../components/common/Badge";

const CreateUser = () => {
  const [openModal, setOpenModal] = useState(false);

  const users = [
    {
      id: 1,
      fullName: "Dr. Sharma",
      email: "doctor@gmail.com",
      role: "doctor",
    },

    {
      id: 2,
      fullName: "Ravi Therapist",
      email: "therapist@gmail.com",
      role: "therapist",
    },
  ];

  const columns = [
    {
      header: "Name",
      key: "fullName",
    },

    {
      header: "Email",
      key: "email",
    },

    {
      header: "Role",
      key: "role",

      render: (user) => <Badge variant="info">{user.role}</Badge>,
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Users"
        subtitle="Manage staff accounts"
        action={
          <Button onClick={() => setOpenModal(true)}>+ Create User</Button>
        }
      />

      <Table columns={columns} data={users} />

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Create User"
      >
        <div className="space-y-4">
          <Input label="Full Name" placeholder="Enter name" />

          <Input label="Email" type="email" placeholder="Enter email" />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
          />

          <Select
            label="Role"
            options={[
              {
                value: "admin",
                label: "Admin",
              },

              {
                value: "doctor",
                label: "Doctor",
              },

              {
                value: "therapist",
                label: "Therapist",
              },
            ]}
          />

          <Button
            onClick={() => {
              alert("User Created");

              setOpenModal(false);
            }}
          >
            Save User
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default CreateUser;
