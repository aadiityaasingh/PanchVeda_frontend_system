import { useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Badge from "../../components/common/Badge";

const BillList = () => {
  const [openModal, setOpenModal] = useState(false);

  const bill = {
    patient: "Ravi Kumar",

    therapyPlan: "Nasya Plan",

    totalAmount: 20000,

    paidAmount: 12000,

    balance: 8000,

    status: "pending",
  };

  return (
    <DashboardLayout>
      <PageHeader title="Billing" subtitle="Manage patient payments" />

      <div className="bg-white rounded-xl shadow p-6 max-w-xl">
        <div className="flex justify-between items-center mb-5">
          <div>
            <h2 className="text-2xl font-bold">{bill.patient}</h2>

            <p className="text-slate-500">{bill.therapyPlan}</p>
          </div>

          <Badge variant={bill.status === "paid" ? "success" : "warning"}>
            {bill.status}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Total Amount</span>

            <strong>₹{bill.totalAmount}</strong>
          </div>

          <div className="flex justify-between">
            <span>Paid</span>

            <strong>₹{bill.paidAmount}</strong>
          </div>

          <div className="flex justify-between text-lg">
            <span>Balance</span>

            <strong>₹{bill.balance}</strong>
          </div>
        </div>

        <Button className="mt-6" onClick={() => setOpenModal(true)}>
          Add Payment
        </Button>
      </div>

      <Modal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        title="Add Payment"
      >
        <div className="space-y-5">
          <Input label="Amount" type="number" placeholder="Enter amount" />

          <Button
            onClick={() => {
              alert("Payment Added");

              setOpenModal(false);
            }}
          >
            Save Payment
          </Button>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default BillList;
