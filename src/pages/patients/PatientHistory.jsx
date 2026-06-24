import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const PatientHistory = () => {
  const [activeTab, setActiveTab] = useState("plans");

  const dummyPlans = [
    {
      id: 1,
      therapy: "Nasya",
      startDate: "2026-06-20",
      endDate: "2026-06-27",
      status: "Active",
    },
  ];

  const dummySessions = [
    {
      id: 1,
      therapy: "Nasya",
      date: "2026-06-24",
      status: "Completed",
    },
  ];

  const dummyBills = [
    {
      id: 1,
      amount: 5000,
      paid: 3000,
      balance: 2000,
    },
  ];

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-6">
        Patient History
      </h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("plans")}
          className={`px-4 py-2 rounded ${
            activeTab === "plans"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Therapy Plans
        </button>

        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-4 py-2 rounded ${
            activeTab === "sessions"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Sessions
        </button>

        <button
          onClick={() => setActiveTab("bills")}
          className={`px-4 py-2 rounded ${
            activeTab === "bills"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Bills
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {activeTab === "plans" &&
          dummyPlans.map((plan) => (
            <div
              key={plan.id}
              className="border-b py-3"
            >
              <p>
                <strong>Therapy:</strong>{" "}
                {plan.therapy}
              </p>

              <p>
                {plan.startDate} - {plan.endDate}
              </p>

              <p>{plan.status}</p>
            </div>
          ))}

        {activeTab === "sessions" &&
          dummySessions.map((session) => (
            <div
              key={session.id}
              className="border-b py-3"
            >
              <p>{session.therapy}</p>

              <p>{session.date}</p>

              <p>{session.status}</p>
            </div>
          ))}

        {activeTab === "bills" &&
          dummyBills.map((bill) => (
            <div
              key={bill.id}
              className="border-b py-3"
            >
              <p>Total: ₹{bill.amount}</p>

              <p>Paid: ₹{bill.paid}</p>

              <p>Balance: ₹{bill.balance}</p>
            </div>
          ))}
      </div>
    </DashboardLayout>
  );
};

export default PatientHistory;