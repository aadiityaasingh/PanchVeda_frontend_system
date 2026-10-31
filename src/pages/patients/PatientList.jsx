import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Modal from "../../components/common/Modal";
import { getPatients, updatePatient } from "../../api/patientApi";
import { useAuth } from "../../context/AuthContext";
import { apiError, formatDate } from "../../utils/formatters";
import { FaUserPlus, FaCalendarPlus, FaEdit, FaHistory } from "react-icons/fa";

const PatientList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "doctor";

  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Edit patient modal
  const [editingPatient, setEditingPatient] = useState(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    medicalNotes: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await getPatients({ search, limit: 100 });
      setPatients(res.data || []);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPatients();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  const openEdit = (p) => {
    setEditingPatient(p);
    setEditForm({
      fullName: p.fullName || "",
      phone: p.phone || "",
      address: p.address || "",
      medicalNotes: p.medicalNotes || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSavingEdit(true);
      setError("");
      await updatePatient(editingPatient._id, editForm);
      setSuccess(`Patient ${editForm.fullName} updated successfully.`);
      setEditingPatient(null);
      loadPatients();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSavingEdit(false);
    }
  };

  const columns = [
    {
      header: "Patient",
      key: "fullName",
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm">
            {p.fullName?.charAt(0)?.toUpperCase() || "P"}
          </div>
          <div>
            <div className="font-semibold text-slate-900">{p.fullName}</div>
            <div className="text-xs text-slate-500 capitalize">
              {p.gender} · {formatDate(p.dateOfBirth)}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Phone",
      key: "phone",
      render: (p) => <span className="font-medium text-slate-700">{p.phone}</span>,
    },
    {
      header: "Address",
      key: "address",
      render: (p) => (
        <span className="text-sm text-slate-600 max-w-xs truncate block">
          {p.address || "—"}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "action",
      render: (p) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-xs py-1 px-2.5 flex items-center gap-1"
            onClick={() => navigate(`/patients/${p._id}`)}
            title="View History & Records"
          >
            <FaHistory /> {canManage ? "History" : "Medical Records"}
          </Button>

          {canManage && (
            <>
              <Button
                variant="primary"
                className="text-xs py-1 px-2.5 flex items-center gap-1"
                onClick={() => navigate(`/plans/add?patientId=${p._id}`)}
                title="Create Therapy Plan"
              >
                <FaCalendarPlus /> Plan
              </Button>

              <Button
                variant="secondary"
                className="text-xs py-1 px-2.5"
                onClick={() => openEdit(p)}
                title="Edit Patient Details"
              >
                <FaEdit />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Patient Directory"
        subtitle={
          canManage
            ? "Clinical directory of all registered patients"
            : "Patient records, clinical history, and treatment directives"
        }
        action={
          canManage ? (
            <Button
              onClick={() => navigate("/patients/add")}
              className="flex items-center gap-2"
            >
              <FaUserPlus /> Register Patient
            </Button>
          ) : null
        }
      />

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800 border border-emerald-200">
          {success}
        </div>
      )}

      <div className="mb-6 max-w-md">
        <Input
          placeholder="Search by patient name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        data={patients}
        emptyMessage={
          loading ? "Loading patients…" : "No registered patients found."
        }
      />

      {/* Edit Patient Modal (Admin / Doctor only) */}
      {canManage && (
        <Modal
          isOpen={Boolean(editingPatient)}
          onClose={() => setEditingPatient(null)}
          title="Edit Patient Details"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Full Name
              </label>
              <input
                required
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm({ ...editForm, fullName: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone Number
              </label>
              <input
                required
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({ ...editForm, phone: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>
              <input
                value={editForm.address}
                onChange={(e) =>
                  setEditForm({ ...editForm, address: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Medical Notes
              </label>
              <textarea
                rows="3"
                value={editForm.medicalNotes}
                onChange={(e) =>
                  setEditForm({ ...editForm, medicalNotes: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingPatient(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={savingEdit}>
                {savingEdit ? "Updating…" : "Update Patient"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default PatientList;
