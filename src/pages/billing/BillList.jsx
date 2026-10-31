import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/common/PageHeader";
import Table from "../../components/common/Table";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Badge from "../../components/common/Badge";
import Input from "../../components/common/Input";
import { addPayment, getBills } from "../../api/billApi";
import { useAuth } from "../../context/AuthContext";
import { apiError, formatCurrency, formatDate } from "../../utils/formatters";
import { FaMoneyBillWave, FaReceipt, FaCheckCircle, FaPrint } from "react-icons/fa";

const BillList = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Payment modal state
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  // Invoice / receipt modal state
  const [receiptBill, setReceiptBill] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const r = await getBills();
      setBills(r.data || []);
    } catch (e) {
      setError(apiError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!selected) return;
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await addPayment(selected._id, amount);
      setSuccess(`Payment of ${formatCurrency(amount)} recorded successfully.`);
      setSelected(null);
      setAmount("");
      load();
    } catch (e) {
      setError(apiError(e));
    } finally {
      setSaving(false);
    }
  };

  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const patientName = b.patient?.fullName?.toLowerCase() || "";
      const matchesSearch = patientName.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [bills, search, statusFilter]);

  // Financial summary
  const summary = useMemo(() => {
    let total = 0;
    let paid = 0;
    bills.forEach((b) => {
      total += b.totalAmount || 0;
      paid += b.paidAmount || 0;
    });
    return { total, paid, balance: total - paid };
  }, [bills]);

  const canPay = user?.role === "admin";

  const columns = [
    {
      header: "Patient",
      key: "patient",
      render: (b) => (
        <div>
          <div className="font-semibold text-slate-900">
            {b.patient?.fullName || "—"}
          </div>
          <div className="text-xs text-slate-500">{b.patient?.phone || ""}</div>
        </div>
      ),
    },
    {
      header: "Plan Dates",
      key: "plan",
      render: (b) =>
        b.therapyPlan ? (
          <span className="text-sm text-slate-700">
            {formatDate(b.therapyPlan.startDate)} –{" "}
            {formatDate(b.therapyPlan.endDate)}
          </span>
        ) : (
          "—"
        ),
    },
    {
      header: "Total Billed",
      key: "totalAmount",
      render: (b) => (
        <span className="font-semibold text-slate-900">
          {formatCurrency(b.totalAmount)}
        </span>
      ),
    },
    {
      header: "Amount Paid",
      key: "paidAmount",
      render: (b) => (
        <span className="font-semibold text-emerald-700">
          {formatCurrency(b.paidAmount)}
        </span>
      ),
    },
    {
      header: "Balance Due",
      key: "balance",
      render: (b) => {
        const bal = (b.totalAmount || 0) - (b.paidAmount || 0);
        return (
          <span
            className={`font-bold ${
              bal > 0 ? "text-amber-600" : "text-slate-400"
            }`}
          >
            {formatCurrency(bal)}
          </span>
        );
      },
    },
    {
      header: "Status",
      key: "status",
      render: (b) => (
        <Badge
          variant={
            b.status === "paid"
              ? "success"
              : b.status === "partial"
              ? "warning"
              : "danger"
          }
        >
          {b.status?.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: "Actions",
      key: "action",
      render: (b) => (
        <div className="flex items-center gap-2">
          {canPay && b.status !== "paid" && (
            <Button
              variant="primary"
              className="text-xs py-1 px-3"
              onClick={() => {
                setSelected(b);
                setAmount(String(b.totalAmount - b.paidAmount));
              }}
            >
              Collect
            </Button>
          )}
          <Button
            variant="outline"
            className="text-xs py-1 px-2.5"
            onClick={() => setReceiptBill(b)}
            title="View Receipt"
          >
            <FaReceipt />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <PageHeader
        title="Billing & Invoices"
        subtitle="Manage therapy plan billings, balances, and payment collections"
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

      {/* Summary KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 border-l-4 border-blue-600">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Total Invoiced
          </p>
          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatCurrency(summary.total)}
          </p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 border-l-4 border-emerald-600">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Total Collected
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">
            {formatCurrency(summary.paid)}
          </p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200 border-l-4 border-amber-500">
          <p className="text-xs font-semibold text-slate-500 uppercase">
            Pending Balance
          </p>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {formatCurrency(summary.balance)}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search bills by patient name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600 font-medium">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All bills</option>
            <option value="unpaid">Unpaid</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredBills}
        emptyMessage={
          loading ? "Loading invoices…" : "No billing records found."
        }
      />

      {/* Payment Collection Modal */}
      <Modal
        isOpen={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Record Bill Payment"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-1">
            <p className="text-sm text-slate-700">
              Patient:{" "}
              <strong>{selected?.patient?.fullName || "—"}</strong>
            </p>
            <p className="text-sm text-slate-700">
              Total Amount:{" "}
              <strong>{formatCurrency(selected?.totalAmount)}</strong>
            </p>
            <p className="text-sm text-slate-700">
              Already Paid:{" "}
              <strong className="text-emerald-700">
                {formatCurrency(selected?.paidAmount)}
              </strong>
            </p>
            <p className="text-sm text-slate-700">
              Outstanding Due:{" "}
              <strong className="text-amber-700">
                {selected &&
                  formatCurrency(selected.totalAmount - selected.paidAmount)}
              </strong>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Payment Amount (₹)
            </label>
            <input
              autoFocus
              type="number"
              min="1"
              max={
                selected ? selected.totalAmount - selected.paidAmount : undefined
              }
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3 text-lg font-bold outline-none focus:border-blue-600"
              placeholder="Enter amount"
            />
            <p className="mt-1 text-xs text-slate-500">
              Max allowable:{" "}
              {selected &&
                formatCurrency(selected.totalAmount - selected.paidAmount)}
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelected(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={submit}
              disabled={saving || !amount || Number(amount) <= 0}
            >
              {saving ? "Saving…" : "Confirm Payment"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Receipt / Invoice Modal */}
      <Modal
        isOpen={Boolean(receiptBill)}
        onClose={() => setReceiptBill(null)}
        title="Panchveda Treatment Receipt"
      >
        {receiptBill && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl text-slate-900">
                  Panchveda Ayurvedic Centre
                </h3>
                <p className="text-xs text-slate-500">
                  Official Invoicing & Clinical Billing
                </p>
              </div>
              <Badge
                variant={
                  receiptBill.status === "paid" ? "success" : "warning"
                }
              >
                {receiptBill.status?.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block uppercase">
                  Patient Name
                </span>
                <span className="font-semibold text-slate-900 text-base">
                  {receiptBill.patient?.fullName}
                </span>
                <span className="text-slate-500 block">
                  {receiptBill.patient?.phone}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block uppercase">
                  Invoice Date
                </span>
                <span className="font-medium text-slate-800">
                  {formatDate(receiptBill.createdAt)}
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-4 border border-slate-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Treatment Charges</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(receiptBill.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Total Paid Amount</span>
                <span className="font-bold text-emerald-700">
                  {formatCurrency(receiptBill.paidAmount)}
                </span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between text-base font-bold">
                <span className="text-slate-900">Remaining Balance</span>
                <span className="text-amber-700">
                  {formatCurrency(
                    receiptBill.totalAmount - receiptBill.paidAmount
                  )}
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setReceiptBill(null)}
              >
                Close
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.print()}
                className="flex items-center gap-2"
              >
                <FaPrint /> Print Receipt
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default BillList;
