import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Select from "../../components/common/Select";
import Input from "../../components/common/Input";
import Badge from "../../components/common/Badge";

const SessionList = () => {
  const [openModal, setOpenModal] = useState(false);

  const [selectedSession, setSelectedSession] = useState(null);

  const sessions = [
    {
      id: 1,
      therapy: "Nasya",
      date: "2026-06-24",
      status: "scheduled",
    },

    {
      id: 2,
      therapy: "Basti",
      date: "2026-06-25",
      status: "completed",
    },
  ];

  const handleUpdate = (session) => {
    setSelectedSession(session);

    setOpenModal(true);
  };

  const columns = [
    {
      header: "Therapy",
      key: "therapy",
    },

    {
      header: "Date",
      key: "date",
    },

    {
      header: "Status",
      key: "status",

      render: (session) => {
        const statusVariant = {
          completed: "success",

          scheduled: "warning",

          missed: "danger",

          cancelled: "danger",
        };

        return (
          <Badge variant={statusVariant[session.status]}>
            {session.status}
          </Badge>
        );
      },
    },

    {
      header: "Action",
      key: "action",

      render: (session) => (
        <Button variant="outline" onClick={() => handleUpdate(session)}>
          Update
        </Button>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader title="Sessions" subtitle="Manage therapy sessions" />

      <Table columns={columns} data={sessions} />

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Update Session"
      >
        <div className="space-y-4">
          <Select
            label="Status"
            options={[
              {
                value: "completed",
                label: "Completed",
              },

              {
                value: "missed",
                label: "Missed",
              },

              {
                value: "cancelled",
                label: "Cancelled",
              },
            ]}
          />

          <Input label="Notes" placeholder="Session notes" />

          <Button
            onClick={() => {
              console.log(selectedSession);

              setOpenModal(false);
            }}
          >
            Save Update
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default SessionList;
