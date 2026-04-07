import { IndianRupee, Wallet, TrendingDown, ReceiptText } from "lucide-react";

const transactions = [
  { title: "Food", amount: 1200, date: "Apr 05" },
  { title: "Travel", amount: 800, date: "Apr 04" },
  { title: "Rent", amount: 8000, date: "Apr 01" }
];

const LivePreview = () => {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-14">
      <div className="surface-card p-6">
        <div className="mb-5 flex items-center gap-2 text-sm font-medium text-white">
          <Wallet size={16} />
          Live Expense Preview
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
            <p className="text-sm text-gray-400">Balance</p>
            <p className="mt-1 flex items-center text-2xl font-bold text-white"><IndianRupee size={20} />25,000</p>
          </div>
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
            <p className="text-sm text-gray-400">Expenses</p>
            <p className="mt-1 flex items-center text-2xl font-bold text-white"><IndianRupee size={20} />10,000</p>
          </div>
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-4">
            <p className="text-sm text-gray-400">Remaining</p>
            <p className="mt-1 flex items-center text-2xl font-bold text-white"><IndianRupee size={20} />15,000</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          {transactions.map((tx) => (
            <div key={`${tx.title}-${tx.date}`} className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3">
              <div className="flex items-center gap-2">
                <ReceiptText size={16} className="text-white" />
                <div>
                  <p className="text-sm font-medium text-white">{tx.title}</p>
                  <p className="text-xs text-gray-400">{tx.date}</p>
                </div>
              </div>
              <p className="flex items-center text-sm font-semibold text-red-400">
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
