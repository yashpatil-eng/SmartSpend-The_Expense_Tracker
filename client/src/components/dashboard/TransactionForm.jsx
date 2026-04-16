import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, AlertTriangle } from "lucide-react";
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
  const [successMessage, setSuccessMessage] = useState("");
  const [successDetails, setSuccessDetails] = useState("");

  // ✅ Reset form to initial state
  const resetForm = () => {
    const fresh = getNowDefaults();
    setForm({
      amount: "",
      type: "expense",
      category: "Food",
      date: fresh.date,
      time: fresh.time,
      notes: "",
      items: [{ name: "", price: "" }],
      billImage: null
    });
    setPreview("");
    setError("");
    setSuccessMessage("");
    setSuccessDetails("");
  };

  useEffect(() => {
    if (!open) return;
    const fresh = getNowDefaults();
    setForm((prev) => ({ ...prev, date: fresh.date, time: fresh.time }));
  }, [open]);

  // ✅ Calculate items total (breakdown of main amount)
  const itemsTotal = useMemo(
    () =>
      form.items.reduce((sum, item) => {
        const price = Number(item.price || 0);
        return sum + (Number.isFinite(price) ? price : 0);
      }, 0),
    [form.items]
  );

  // ✅ Main amount is primary (from amount field, not items)
  const mainAmount = Number(form.amount || 0);

  // ✅ Calculate remaining amount
  const remainingAmount = mainAmount - itemsTotal;

  // ✅ Validation status
  const validationStatus = useMemo(() => {
    if (!mainAmount) return { type: "neutral", text: "Enter amount" };
    if (form.items.length <= 1 && !form.items[0].name) return { type: "balanced", text: "✓ No items breakdown" };
    if (itemsTotal > mainAmount) return { type: "error", text: "❌ Items exceed amount" };
    if (itemsTotal === mainAmount) return { type: "success", text: "✓ Balanced" };
    if (itemsTotal > 0) return { type: "warning", text: `⚠ Remaining: ₹${remainingAmount.toFixed(2)}` };
    return { type: "neutral", text: "Add item breakdown (optional)" };
  }, [mainAmount, itemsTotal, remainingAmount, form.items]);

  const canSubmit = mainAmount > 0 && itemsTotal <= mainAmount && !loading;

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
    if (form.items.length === 1) return;
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (file) => {
    setForm((prev) => ({ ...prev, billImage: file || null }));
    setPreview(file ? URL.createObjectURL(file) : "");
  };

  // ✅ Auto-fill amount from items total
  const handleAutoFillAmount = () => {
    if (itemsTotal > 0) {
      setForm((prev) => ({ ...prev, amount: String(itemsTotal) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // ✅ Validation: Amount is required
    if (!mainAmount || mainAmount <= 0) {
      setError("Please enter a valid amount (must be greater than 0)");
      return;
    }

    // ✅ Validation: Items cannot exceed amount
    if (itemsTotal > mainAmount) {
      setError("Items total cannot exceed the main amount");
      return;
    }

    const payload = new FormData();
    // ✅ Use mainAmount (not items total)
    payload.append("amount", String(mainAmount));
    payload.append("type", form.type);
    payload.append("category", form.category);
    payload.append("notes", form.notes);
    payload.append("date", `${form.date}T${form.time}:00`);
    // ✅ Send items as breakdown
    payload.append(
      "items",
      JSON.stringify(form.items.filter((item) => item.name.trim() && Number(item.price) > 0))
    );
    if (form.billImage) payload.append("billImage", form.billImage);

    try {
      // ✅ Call onSubmit and await response
      const response = await onSubmit(payload);

      // ✅ Show success message from backend
      setSuccessMessage(response?.message || "✓ Transaction added successfully");
      
      // ✅ Extract remaining amount info if it exists
      if (response?.remainingTransaction) {
        const remaining = response.remainingTransaction.amount;
        setSuccessDetails(`Remaining amount ₹${remaining.toFixed(2)} added as 'Other'`);
      }

      // ✅ Reset form after short delay and close modal
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1500);
    } catch (err) {
      // ✅ Show error from API or fallback message
      const errorMsg = err.response?.data?.message || err.message || "Failed to save transaction";
      setError(errorMsg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <form onSubmit={handleSubmit} className="surface-card max-h-[92vh] w-full max-w-2xl overflow-y-auto p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Add Transaction</h3>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Close</button>
        </div>

        {/* Success Message */}
        {successMessage ? (
          <div className="mb-3 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-3 space-y-1">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={18} />
              <span className="font-medium">{successMessage}</span>
            </div>
            {successDetails && (
              <p className="text-sm text-green-300 ml-7">{successDetails}</p>
            )}
          </div>
        ) : null}

        {/* Error Message */}
        {error ? (
          <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400 flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Amount (Main Total)</label>
            <input
              className="field-input"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter total amount"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              disabled={loading || successMessage}
              required
            />
          </div>
          <select 
            className="field-input" 
            value={form.type} 
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            disabled={loading || successMessage}
          >
            <option value="income">Cash In (Income)</option>
            <option value="expense">Cash Out (Expense)</option>
          </select>
          <input 
            className="field-input" 
            type="date" 
            value={form.date} 
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} 
            disabled={loading || successMessage}
            required 
          />
          <input 
            className="field-input" 
            type="time" 
            value={form.time} 
            onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
            disabled={loading || successMessage}
            required 
          />
          <select 
            className="field-input md:col-span-2" 
            value={form.category} 
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            disabled={loading || successMessage}
          >
            {defaultCategories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <textarea 
            className="field-input md:col-span-2" 
            rows={3} 
            placeholder="Notes" 
            value={form.notes} 
            onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            disabled={loading || successMessage}
          />
        </div>

        {/* Items Breakdown Section */}
        <div className="mt-5 space-y-3 border-t border-zinc-700 pt-5">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Item Breakdown (Optional)</h4>
            <button 
              type="button" 
              className="btn-secondary text-sm" 
              onClick={addItem}
              disabled={loading || successMessage}
            >
              + Add Item
            </button>
          </div>

          {form.items.map((item, index) => (
            <div key={`${index}-${item.name}`} className="grid gap-2 md:grid-cols-[1fr_140px_100px]">
              <input
                className="field-input"
                placeholder="Item name"
                value={item.name}
                onChange={(e) => updateItem(index, "name", e.target.value)}
                disabled={loading || successMessage}
              />
              <input
                className="field-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="Price"
                value={item.price}
                onChange={(e) => updateItem(index, "price", e.target.value)}
                disabled={loading || successMessage}
              />
              <button
                type="button"
                className="btn-danger"
                onClick={() => removeItem(index)}
                disabled={form.items.length === 1 || loading || successMessage}
              >
                Remove
              </button>
            </div>
          ))}

          {/* Items Summary and Validation */}
          {mainAmount > 0 && (
            <div className="mt-4 space-y-2 rounded-lg border border-zinc-700 p-4 bg-zinc-900/50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Main Amount:</p>
                  <p className="text-lg font-semibold text-white">₹{mainAmount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Items Total:</p>
                  <p className={`text-lg font-semibold ${itemsTotal > 0 ? "text-blue-400" : "text-gray-400"}`}>
                    ₹{itemsTotal.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Validation Status */}
              <div className={`mt-3 rounded-lg p-3 flex items-center gap-2 ${
                validationStatus.type === "error" ? "border border-red-500/30 bg-red-500/10 text-red-400" :
                validationStatus.type === "success" ? "border border-green-500/30 bg-green-500/10 text-green-400" :
                validationStatus.type === "warning" ? "border border-yellow-500/30 bg-yellow-500/10 text-yellow-400" :
                "border border-zinc-600 bg-zinc-800/50 text-zinc-400"
              }`}>
                {validationStatus.type === "error" && <AlertCircle size={16} />}
                {validationStatus.type === "success" && <CheckCircle size={16} />}
                {validationStatus.type === "warning" && <AlertTriangle size={16} />}
                <span className="text-sm font-medium">{validationStatus.text}</span>
              </div>

              {/* Auto-fill Button (if items exist and total is less than amount) */}
              {itemsTotal > 0 && itemsTotal < mainAmount && (
                <button
                  type="button"
                  onClick={handleAutoFillAmount}
                  className="mt-2 w-full rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-400 transition hover:bg-blue-500/20"
                  disabled={loading || successMessage}
                >
                  📝 Auto-fill Amount from Items (₹{itemsTotal.toFixed(2)})
                </button>
              )}
            </div>
          )}
        </div>

        {/* Bill Upload Section */}
        <div className="mt-5 space-y-2 border-t border-zinc-700 pt-5">
          <label className="text-sm text-gray-400">Bill Photo Upload (Optional)</label>
          <input
            className="field-input"
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files?.[0])}
            disabled={loading || successMessage}
          />
          {preview ? (
            <img src={preview} alt="Bill preview" className="h-40 rounded-xl border border-zinc-700 object-cover" />
          ) : null}
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary min-w-40"
            disabled={!canSubmit}
          >
            {loading ? (
              <>
                <LoadingSpinner /> Saving...
              </>
            ) : successMessage ? (
              "✓ Saved!"
            ) : (
              "Save Transaction"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
