import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['deposit', 'withdrawal'], required: true },
    amount: { type: Number, required: true },
    note: String,
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction
