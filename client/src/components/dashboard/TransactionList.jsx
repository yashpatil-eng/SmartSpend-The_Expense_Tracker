import { useState } from "react";
import { formatDate } from "../../utils/format";

const host = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const TransactionList = ({ transactions, onDelete, deletingId }) => {
  const [expandedId, setExpandedId] = useState("");

  if (!transactions.length) {
    return <p className="text-sm text-gray-400">No transactions yet. Add your first transaction.</p>;
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => {
        const expanded = expandedId === tx._id;
        return (
          <article key={tx._id} className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-white">Rs. {tx.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-400">{tx.category} • {formatDate(tx.date)}</p>
                {tx.notes ? <p className="mt-1 text-sm text-gray-400">{tx.notes}</p> : null}
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs ${tx.type === "income" ? "bg-white text-black" : "bg-zinc-800 text-white border border-zinc-700"}`}>
                  {tx.type === "income" ? "Cash In" : "Cash Out"}
                </span>
                <button type="button" className="btn-secondary" onClick={() => setExpandedId(expanded ? "" : tx._id)}>
                  {expanded ? "Hide" : "Details"}
                </button>
                <button type="button" className="btn-danger" onClick={() => onDelete(tx._id)} disabled={deletingId === tx._id}>
                  {deletingId === tx._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>

            {expanded ? (
              <div className="mt-3 space-y-3 border-t border-zinc-700 pt-3">
                {tx.items?.length ? (
                  <div>
                    <p className="mb-2 text-sm text-gray-400">Items</p>
                    <div className="space-y-1">
                      {tx.items.map((item, index) => (
                        <div key={`${item.name}-${index}`} className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span>Rs. {item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                {tx.billImage ? (
                  <img
                    src={`${host}${tx.billImage}`}
                    alt="Bill"
                    className="max-h-56 rounded-xl border border-zinc-700 object-cover"
                  />
                ) : null}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
};

export default TransactionList;
