import { formatCurrency, formatDate } from "../utils/format";

const ExpenseTable = ({ expenses, onEdit, onDelete }) => (
  <div className="overflow-x-auto rounded-2xl border border-zinc-700 bg-zinc-900 shadow-[0_10px_30px_rgba(229,229,229,0.05)]">
    <table className="min-w-full text-sm">
      <thead className="bg-zinc-800 text-left text-gray-400">
        <tr>
          <th className="px-4 py-3">Date</th>
          <th className="px-4 py-3">Category</th>
          <th className="px-4 py-3">Amount</th>
          <th className="px-4 py-3">Note</th>
          <th className="px-4 py-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense._id} className="border-t border-zinc-700 text-white">
            <td className="px-4 py-3">{formatDate(expense.date)}</td>
            <td className="px-4 py-3">{expense.category}</td>
            <td className="px-4 py-3">{formatCurrency(expense.amount)}</td>
            <td className="px-4 py-3">{expense.note || "-"}</td>
            <td className="px-4 py-3">
              <button className="mr-2 text-gray-300 hover:text-white" onClick={() => onEdit(expense)}>Edit</button>
              <button className="text-red-400 hover:text-red-300" onClick={() => onDelete(expense._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ExpenseTable;
