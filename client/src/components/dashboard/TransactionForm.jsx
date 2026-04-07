import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "../auth/LoadingSpinner";

const defaultCategories = ["Food", "Travel", "Bills", "Shopping", "Health", "Salary", "Other"];

const getNowDefaults = () => {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toTimeString().slice(0, 5);
  return { date, time };
};

const TransactionForm = ({ open, onClose, onSubmit, loading }) => {
  const defaults = getNowDefaults();
  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "Food",
    date: defaults.date,
    time: defaults.time,
    notes: "",
    items: [{ name: "", price: "" }],
    billImage: null
  });
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const fresh = getNowDefaults();
    setForm((prev) => ({ ...prev, date: fresh.date, time: fresh.time }));
  }, [open]);

  const computedTotal = useMemo(
    () =>
      form.items.reduce((sum, item) => {
        const price = Number(item.price || 0);
        return sum + (Number.isFinite(price) ? price : 0);
      }, 0),
    [form.items]
  );

  if (!open) return null;

  const updateItem = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    }));
  };

  const addItem = () => {
    setForm((prev) => ({ ...prev, items: [...prev.items, { name: "", price: "" }] }));
  };

  const removeItem = (index) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (file) => {
    setForm((prev) => ({ ...prev, billImage: file || null }));
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.amount && computedTotal <= 0) {
      setError("Enter an amount or add items with prices.");
      return;
    }

    const payload = new FormData();
    payload.append("amount", String(form.amount || computedTotal));
    payload.append("type", form.type);
    payload.append("category", form.category);
    payload.append("notes", form.notes);
    payload.append("date", `${form.date}T${form.time}:00`);
    payload.append(
      "items",
      JSON.stringify(form.items.filter((item) => item.name.trim() && Number(item.price) >= 0))
    );
    if (form.billImage) payload.append("billImage", form.billImage);

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form onSubmit={handleSubmit} className="surface-card max-h-[92vh] w-full max-w-2xl overflow-y-auto p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Add Transaction</h3>
          <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
        </div>

        {error ? <p className="mb-3 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-red-400">{error}</p> : null}

        <div className="grid gap-3 md:grid-cols-2">
          <input className="field-input" type="number" min="0" step="0.01" placeholder="Amount" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} />
          <select className="field-input" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
            <option value="income">Cash In (Income)</option>
            <option value="expense">Cash Out (Expense)</option>
          </select>
          <input className="field-input" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} required />
          <input className="field-input" type="time" value={form.time} onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} required />
          <select className="field-input md:col-span-2" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
            {defaultCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <textarea className="field-input md:col-span-2" rows={3} placeholder="Notes" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Items</h4>
            <button type="button" className="btn-secondary" onClick={addItem}>Add Item</button>
          </div>
          {form.items.map((item, index) => (
            <div key={`${index}-${item.name}`} className="grid gap-2 md:grid-cols-[1fr_140px_100px]">
              <input className="field-input" placeholder="Item Name" value={item.name} onChange={(e) => updateItem(index, "name", e.target.value)} />
              <input className="field-input" type="number" min="0" step="0.01" placeholder="Price" value={item.price} onChange={(e) => updateItem(index, "price", e.target.value)} />
              <button type="button" className="btn-danger" onClick={() => removeItem(index)} disabled={form.items.length === 1}>
                Remove
              </button>
            </div>
          ))}
          <p className="text-sm text-gray-400">Items Total: <span className="text-white">Rs. {computedTotal.toFixed(2)}</span></p>
        </div>

        <div className="mt-5 space-y-2">
          <label className="text-sm text-gray-400">Bill Photo Upload</label>
          <input className="field-input" type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files?.[0])} />
          {preview ? <img src={preview} alt="Bill preview" className="h-40 rounded-xl border border-zinc-700 object-cover" /> : null}
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" className="btn-primary min-w-40" disabled={loading}>
            {loading ? <LoadingSpinner /> : null}
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
