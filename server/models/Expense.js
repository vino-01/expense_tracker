const mongoose = require("mongoose")

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Food", "Travel", "Rent", "Shopping", "Others"],
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
ExpenseSchema.index({ userId: 1, date: -1 })
ExpenseSchema.index({ userId: 1, category: 1 })

module.exports = mongoose.model("Expense", ExpenseSchema)
