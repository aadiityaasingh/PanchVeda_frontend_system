import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import { createUser, getUsers, toggleUserStatus } from "../../api/userApi";
import { apiError, formatDate } from "../../utils/formatters";

const DEMO_EMAILS = [
  "admin@panchveda.com",
  "dr.ananya@panchveda.com",
  "dr.rajesh@panchveda.com",
  "vikram@panchveda.com",
  "sneha@panchveda.com"
];

const initialForm = { fullName: "", email: "", password: "", role: "doctor" };

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [togglingId, setTogglingId] = useState(null);

  const load = async () => {
    try {
      const r = await getUsers();
      setUsers(r.data || []);
    } catch (e) {
      setError(apiError(e));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await createUser(form);
      setSuccess(`User ${form.fullName} created successfully.`);
      setOpen(false);
      setForm(initialForm);
      load();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      setTogglingId(user._id);
      setError("");
      await toggleUserStatus(user._id);
      setSuccess(`Status updated for ${user.fullName}.`);
      load();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const roleBadgeVariant = (role) => {
    switch (role) {
      case "admin":
        return "danger";
      case "doctor":
        return "info";
      case "therapist":
        return "success";
      default:
        return "default";
    }
  };

  const columns = [
    {
      header: "Staff Member",
      key: "fullName",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 text-white font-semibold flex items-center justify-center text-sm">
            {u.fullName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="font-medium text-slate-900">{u.fullName}</div>
            <div className="text-xs text-slate-500">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      key: "role",
      render: (u) => (
        <Badge variant={roleBadgeVariant(u.role)}>
          {u.role?.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: "Joined",
      key: "createdAt",
      render: (u) => (
        <span className="text-sm text-slate-600">
          {formatDate(u.createdAt)}
        </span>
      ),
    },
    {
      header: "Status",
      key: "isActive",
      render: (u) => {
        const isDemo = DEMO_EMAILS.includes(u.email?.toLowerCase());
        return (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={u.isActive ? "success" : "default"}>
              {u.isActive ? "Active" : "Inactive"}
            </Badge>
            {isDemo && (
              <Badge variant="info">
                Demo
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      header: "Actions",
      key: "actions",
      render: (u) => {
        const isDemo = DEMO_EMAILS.includes(u.email?.toLowerCase());
        if (isDemo) {
          return (
            <span className="text-xs text-slate-400 font-medium px-2 py-1 bg-slate-100 rounded border border-slate-200">
              Demo Protected
            </span>
          );
        }
        return (
          <Button
            variant="outline"
            disabled={togglingId === u._id}
            onClick={() => handleToggleStatus(u)}
            className="text-xs py-1 px-3"
          >
            {togglingId === u._id
              ? "Updating…"
              : u.isActive
              ? "Deactivate"
              : "Activate"}
          </Button>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Staff & Users"
        subtitle="Manage clinic administrators, doctors, and therapists"
        action={
          <Button onClick={() => setOpen(true)}>+ Add staff user</Button>
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

      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600 font-medium">Role:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="therapist">Therapist</option>
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredUsers}
        emptyMessage="No staff users found matching criteria."
      />

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Create new staff account"
      >
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-600"
              placeholder="e.g. Dr. Ramesh Gupta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-600"
              placeholder="e.g. ramesh@panchveda.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Initial Password
            </label>
            <input
              required
              minLength="6"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-600"
              placeholder="Minimum 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Staff Role
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-600"
            >
              <option value="doctor">Doctor (Consultation & Plans)</option>
              <option value="therapist">Therapist (Session Management)</option>
              <option value="admin">Admin (Full System Access)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Creating…" : "Create User"}
            </Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default UserList;
