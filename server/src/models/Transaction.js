import mongoose from "mongoose";

const transactionItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ["income", "expense"], required: true },
    category: { type: String, required: true, trim: true },
    notes: { type: String, trim: true, default: "" },
    items: { type: [transactionItemSchema], default: [] },
    tags: { type: [String], default: [] },
    billImage: { type: String, default: "" },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
