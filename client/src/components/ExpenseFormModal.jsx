import { useEffect, useState } from "react";

const defaultForm = {
  amount: "",
  category: "",
  date: "",
  note: ""
};

const ExpenseFormModal = ({ open, onClose, onSubmit, initialValues, categories = [] }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialValues) {
      setForm({
        amount: initialValues.amount,
        category: initialValues.category,
        date: initialValues.date?.slice(0, 10),
        note: initialValues.note || ""
      });
      return;
    }
    setForm(defaultForm);
  }, [initialValues, open]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white p-5">
        <h3 className="mb-4 text-lg font-semibold">{initialValues ? "Edit Expense" : "Add Expense"}</h3>
        <div className="space-y-3">
          <input className="w-full rounded-lg border px-3 py-2" type="number" min="0" step="0.01" placeholder="Amount" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required />
          <select className="w-full rounded-lg border px-3 py-2" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} required>
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input className="w-full rounded-lg border px-3 py-2" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required />
          <textarea className="w-full rounded-lg border px-3 py-2" placeholder="Note" value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="rounded-lg border px-3 py-2" onClick={onClose}>Cancel</button>
          <button type="submit" className="rounded-lg bg-indigo-600 px-3 py-2 text-white">Save</button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseFormModal;
