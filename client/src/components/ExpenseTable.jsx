import { formatCurrency, formatDate } from "../utils/format";

const ExpenseTable = ({ expenses, onEdit, onDelete }) => (
  <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
    <table className="min-w-full text-sm">
      <thead className="bg-slate-50 text-left text-slate-600">
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
          <tr key={expense._id} className="border-t">
            <td className="px-4 py-3">{formatDate(expense.date)}</td>
            <td className="px-4 py-3">{expense.category}</td>
            <td className="px-4 py-3">{formatCurrency(expense.amount)}</td>
            <td className="px-4 py-3">{expense.note || "-"}</td>
            <td className="px-4 py-3">
              <button className="mr-2 text-indigo-600" onClick={() => onEdit(expense)}>Edit</button>
              <button className="text-rose-600" onClick={() => onDelete(expense._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ExpenseTable;
