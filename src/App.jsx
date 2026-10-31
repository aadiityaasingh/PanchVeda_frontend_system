import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import InitialSetup from "./pages/auth/InitialSetup";
import Dashboard from "./pages/dashboard/Dashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import PatientList from "./pages/patients/PatientList";
import AddPatient from "./pages/patients/AddPatient";
import PatientHistory from "./pages/patients/PatientHistory";

import TherapyList from "./pages/therapies/TherapyList";
import AddTherapy from "./pages/therapies/AddTherapy";

import TherapyPlanList from "./pages/plans/TherapyPlanList";
import CreateTherapyPlan from "./pages/plans/CreateTherapyPlan";
import TherapyPlanDetails from "./pages/plans/TherapyPlanDetails";

import SessionList from "./pages/sessions/SessionList";
import BillList from "./pages/billing/BillList";
import Reports from "./pages/reports/Reports";
import UserList from "./pages/users/UserList";
import Unauthorized from "./pages/errors/Unauthorized";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/setup" element={<InitialSetup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roles={["admin", "doctor", "therapist"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Patient Routes: Therapists have read-only clinical access to Directory and History */}
      <Route
        path="/patients"
        element={
          <ProtectedRoute roles={["admin", "doctor", "therapist"]}>
            <PatientList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/add"
        element={
          <ProtectedRoute roles={["admin", "doctor"]}>
            <AddPatient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute roles={["admin", "doctor", "therapist"]}>
            <PatientHistory />
          </ProtectedRoute>
        }
      />

      {/* Therapy Catalogue: Therapists have read-only procedure reference */}
      <Route
        path="/therapies"
        element={
          <ProtectedRoute roles={["admin", "doctor", "therapist"]}>
            <TherapyList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/therapies/add"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AddTherapy />
          </ProtectedRoute>
        }
      />

      {/* Therapy Plans: Therapists can inspect treatment regimens and doctor notes */}
      <Route
        path="/plans"
        element={
          <ProtectedRoute roles={["admin", "doctor", "therapist"]}>
            <TherapyPlanList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plans/add"
        element={
          <ProtectedRoute roles={["admin", "doctor"]}>
            <CreateTherapyPlan />
          </ProtectedRoute>
        }
      />
      <Route
        path="/plans/:id"
        element={
          <ProtectedRoute roles={["admin", "doctor", "therapist"]}>
            <TherapyPlanDetails />
          </ProtectedRoute>
        }
      />

      {/* Sessions Route */}
      <Route
        path="/sessions"
        element={
          <ProtectedRoute roles={["admin", "doctor", "therapist"]}>
            <SessionList />
          </ProtectedRoute>
        }
      />

      {/* Billing Route: Financial privacy reserved for Admin and Doctor */}
      <Route
        path="/bills"
        element={
          <ProtectedRoute roles={["admin", "doctor"]}>
            <BillList />
          </ProtectedRoute>
        }
      />

      {/* Reports Route: Management Analytics */}
      <Route
        path="/reports"
        element={
          <ProtectedRoute roles={["admin", "doctor"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* User Management Route */}
      <Route
        path="/users"
        element={
          <ProtectedRoute roles={["admin"]}>
            <UserList />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
