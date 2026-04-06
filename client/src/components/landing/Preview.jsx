import { IndianRupee, Wallet, TrendingDown, ReceiptText } from "lucide-react";

const transactions = [
  { title: "Food", amount: 1200, date: "Apr 05" },
  { title: "Travel", amount: 800, date: "Apr 04" },
  { title: "Rent", amount: 8000, date: "Apr 01" }
];

const LivePreview = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-emerald-700">
          <Wallet size={16} />
          Live Expense Preview
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-sm text-slate-600">Balance</p>
            <p className="mt-1 flex items-center text-2xl font-bold text-slate-900"><IndianRupee size={20} />25,000</p>
          </div>
          <div className="rounded-xl bg-rose-50 p-4">
            <p className="text-sm text-slate-600">Expenses</p>
            <p className="mt-1 flex items-center text-2xl font-bold text-slate-900"><IndianRupee size={20} />10,000</p>
          </div>
          <div className="rounded-xl bg-green-50 p-4">
            <p className="text-sm text-slate-600">Remaining</p>
            <p className="mt-1 flex items-center text-2xl font-bold text-slate-900"><IndianRupee size={20} />15,000</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {transactions.map((tx) => (
            <div key={`${tx.title}-${tx.date}`} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <ReceiptText size={16} className="text-emerald-600" />
                <div>
                  <p className="text-sm font-medium text-slate-800">{tx.title}</p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
              </div>
              <p className="flex items-center text-sm font-semibold text-rose-600">
                <TrendingDown size={14} className="mr-1" />
                <IndianRupee size={14} />{tx.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LivePreview;
