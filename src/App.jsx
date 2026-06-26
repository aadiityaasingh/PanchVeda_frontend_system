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

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/patients" element={<PatientList />} />
      <Route path="/therapies" element={<TherapyList />} />
      <Route path="/plans" element={<TherapyPlanList />} />
      <Route path="/sessions" element={<SessionList />} />
      <Route path="/bills" element={<BillList />} />
      <Route path="/patients/add" element={<AddPatient />} />
      <Route path="/patients/:id" element={<PatientHistory />} />
      <Route path="/therapies/add" element={<AddTherapy />} />
      <Route path="/plans/add" element={<CreateTherapyPlan />} />
    </Routes>
  );
};

export default App;
