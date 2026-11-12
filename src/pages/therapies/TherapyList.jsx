import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import Button from "../../components/common/Button";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import {
  getTherapies,
  updateTherapy,
  deleteTherapy,
} from "../../api/therapyApi";
import { useAuth } from "../../context/AuthContext";
import { apiError, formatCurrency } from "../../utils/formatters";
import { FaHeartbeat, FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const CORE_CLASSICAL_THERAPIES = [
  "Vamana Therapy",
  "Virechana Therapy",
  "Basti Therapy",
  "Nasya Therapy",
  "Raktamokshana Therapy"
];

const TherapyList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [therapies, setTherapies] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Edit therapy state
  const [editingTherapy, setEditingTherapy] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    category: "",
    defaultDurationDays: "",
    baseCost: "",
    description: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const r = await getTherapies();
      setTherapies(r.data || []);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openEdit = (t) => {
    setEditingTherapy(t);
    setEditForm({
      name: t.name || "",
      category: t.category || "basti",
      defaultDurationDays: t.defaultDurationDays || 1,
      baseCost: t.baseCost || 0,
      description: t.description || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSavingEdit(true);
      setError("");
      await updateTherapy(editingTherapy._id, {
        ...editForm,
        defaultDurationDays: Number(editForm.defaultDurationDays),
        baseCost: Number(editForm.baseCost),
      });
      setSuccess(`Therapy "${editForm.name}" updated successfully.`);
      setEditingTherapy(null);
      load();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (t) => {
    if (
      !window.confirm(
        `Are you sure you want to deactivate therapy "${t.name}"?`
      )
    )
      return;
    try {
      setError("");
      await deleteTherapy(t._id);
      setSuccess(`Therapy "${t.name}" deactivated.`);
      load();
    } catch (err) {
      setError(apiError(err));
    }
  };

  const filteredTherapies = useMemo(() => {
    return therapies.filter((t) => {
      const matchesSearch =
        t.name?.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [therapies, search, categoryFilter]);

  const columns = [
    {
      header: "Therapy Name & Protocol",
      key: "name",
      render: (t) => (
        <div>
          <div className="font-bold text-slate-900">{t.name}</div>
          <div className="text-xs text-slate-500 max-w-sm mt-0.5">
            {t.description || "Traditional Panchakarma therapy procedure"}
          </div>
        </div>
      ),
    },
    {
      header: "Category",
      key: "category",
      render: (t) => {
        const isCore = CORE_CLASSICAL_THERAPIES.includes(t.name);
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="info">
              {t.category?.toUpperCase()}
            </Badge>
            {isCore && (
              <Badge variant="success">
                Classical Core
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: "Standard Duration",
      key: "defaultDurationDays",
      render: (t) => (
        <span className="font-medium text-slate-700">
          {t.defaultDurationDays} days
        </span>
      ),
    },
    {
      header: "Base Cost / Day",
      key: "baseCost",
      render: (t) => (
        <span className="font-bold text-emerald-700">
          {formatCurrency(t.baseCost)}
        </span>
      ),
    },
    ...(isAdmin
      ? [
          {
            header: "Actions",
            key: "action",
            render: (t) => {
              const isCore = CORE_CLASSICAL_THERAPIES.includes(t.name);
              return (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="text-xs py-1 px-2.5 flex items-center gap-1"
                    onClick={() => openEdit(t)}
                    title="Edit Therapy"
                  >
                    <FaEdit /> Edit
                  </Button>
                  {isCore ? (
                    <span
                      title="Classical Panchakarma core therapies cannot be deactivated in demo mode"
                      className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-100 rounded border border-slate-200 cursor-not-allowed"
                    >
                      Core Protected
                    </span>
                  ) : (
                    <Button
                      variant="danger"
                      className="text-xs py-1 px-2.5"
                      onClick={() => handleDelete(t)}
                      title="Deactivate Therapy"
                    >
                      <FaTrashAlt />
                    </Button>
                  )}
                </div>
              );
            },
          },
        ]
      : []),
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Therapy Procedures & Protocols"
        subtitle={
          isAdmin
            ? "Manage the traditional Ayurvedic and Panchakarma therapies offered"
            : "Clinical reference guide for standard Panchakarma procedures, durations, and preparations"
        }
        action={
          isAdmin ? (
            <Button
              onClick={() => navigate("/therapies/add")}
              className="flex items-center gap-2"
            >
              <FaPlus /> Add New Therapy
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

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search therapies by name or keyword…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600 font-medium">Category:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All categories</option>
            <option value="vamana">Vamana</option>
            <option value="virechana">Virechana</option>
            <option value="basti">Basti</option>
            <option value="nasya">Nasya</option>
            <option value="raktamokshana">Raktamokshana</option>
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredTherapies}
        emptyMessage={
          loading ? "Loading therapies…" : "No active therapies found in catalogue."
        }
      />

      {/* Edit Therapy Modal (Admin only) */}
      {isAdmin && (
        <Modal
          isOpen={Boolean(editingTherapy)}
          onClose={() => setEditingTherapy(null)}
          title="Edit Therapy Details"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Therapy Name
              </label>
              <input
                required
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-600"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category
                </label>
                <select
                  required
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({ ...editForm, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 outline-none focus:border-blue-600"
                >
                  <option value="vamana">Vamana</option>
                  <option value="virechana">Virechana</option>
                  <option value="basti">Basti</option>
                  <option value="nasya">Nasya</option>
                  <option value="raktamokshana">Raktamokshana</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Default Days
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={editForm.defaultDurationDays}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      defaultDurationDays: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Base Cost / Day (₹)
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  value={editForm.baseCost}
                  onChange={(e) =>
                    setEditForm({ ...editForm, baseCost: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description / Clinical Preparation
              </label>
              <textarea
                rows="3"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full rounded-lg border border-slate-300 p-2.5 outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingTherapy(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={savingEdit}>
                {savingEdit ? "Updating…" : "Update Therapy"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default TherapyList;
