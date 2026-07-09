import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import PatientList from "./pages/patients/PatientList";
import TherapyList from "./pages/therapies/TherapyList";
import TherapyPlanList from "./pages/plans/TherapyPlanList";
import SessionList from "./pages/sessions/SessionList";
import BillList from "./pages/billing/BillList";
import AddPatient from "./pages/patients/AddPatient";
import PatientHistory from "./pages/patients/PatientHistory";
import AddTherapy from "./pages/therapies/AddTherapy";
import CreateTherapyPlan from "./pages/plans/CreateTherapyPlan";
import TherapyPlanDetails from "./pages/plans/TherapyPlanDetails";
import CreateUser from "./pages/users/CreateUser.";
import Unauthorized from "./pages/errors/Unauthorized";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/patients"
        element={
          <ProtectedRoute roles={["admin", "doctor"]}>
            <PatientList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapies"
        element={
          <ProtectedRoute roles={["admin"]}>
            <TherapyList />
          </ProtectedRoute>
        }
      />
      <Route path="/plans" element={<TherapyPlanList />} />
      <Route
        path="/sessions"
        element={
          <ProtectedRoute roles={["admin", "doctor", "therapist"]}>
            <SessionList />
          </ProtectedRoute>
        }
      />
      <Route path="/bills" element={<BillList />} />
      <Route path="/patients/add" element={<AddPatient />} />
      <Route path="/patients/:id" element={<PatientHistory />} />
      <Route path="/therapies/add" element={<AddTherapy />} />
      <Route path="/plans/add" element={<CreateTherapyPlan />} />
      <Route path="/plans/:id" element={<TherapyPlanDetails />} />
      <Route
        path="/bills"
        element={
          <ProtectedRoute roles={["admin"]}>
            <BillList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute roles={["admin"]}>
            <CreateUser />
          </ProtectedRoute>
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default App;
