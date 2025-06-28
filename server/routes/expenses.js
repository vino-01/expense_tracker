const express = require("express")
const Expense = require("../models/Expense")
const auth = require("../middleware/auth")

const router = express.Router()

// @route   GET /api/expenses
// @desc    Get all expenses for user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id }).sort({ date: -1 })
    res.json(expenses)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
