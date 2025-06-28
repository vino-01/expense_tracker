"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import "./AddExpense.css"

const AddExpense = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    category: "Food",
    note: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const categories = ["Food", "Travel", "Rent", "Shopping", "Others"]

  useEffect(() => {
    if (isEditing) {
      fetchExpense()
    }
  }, [id, isEditing])

  const fetchExpense = async () => {
    try {
      const response = await axios.get(`/expenses/${id}`)
      const expense = response.data
      setFormData({
        amount: expense.amount.toString(),
        date: expense.date.split("T")[0],
        category: expense.category,
        note: expense.note,
      })
    } catch (error) {
      console.error("Error fetching expense:", error)
      navigate("/expenses")
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.amount) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(formData.amount) || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const expenseData = {
        ...formData,
        amount: Number.parseFloat(formData.amount),
      }

      if (isEditing) {
        await axios.put(`/expenses/${id}`, expenseData)
      } else {
        await axios.post("/expenses", expenseData)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }

      // Reset form if adding new expense
      if (!isEditing) {
        setFormData({
          amount: "",
          date: new Date().toISOString().split("T")[0],
          category: "Food",
          note: "",
        })
      }

      setTimeout(
        () => {
          navigate("/expenses")
        },
        isEditing ? 0 : 1500,
      )
    } catch (error) {
      console.error("Error saving expense:", error)
      setErrors({ general: "Failed to save expense. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-expense">
      {showConfetti && <div className="confetti"></div>}

      <div className="add-expense-container">
        <div className="add-expense-header">
          <h1>{isEditing ? "Edit Expense" : "Add New Expense"}</h1>
          <p>{isEditing ? "Update your expense details" : "Track your spending"}</p>
        </div>

        <form onSubmit={handleSubmit} className="expense-form">
          {errors.general && <div className="error-message general-error">{errors.general}</div>}

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className={`form-input ${errors.amount ? "error" : ""}`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`form-input ${errors.date ? "error" : ""}`}
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-input ${errors.category ? "error" : ""}`}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryIcon(category)} {category}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Add a note about this expense..."
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate("/expenses")} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className={`btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
              {loading ? (isEditing ? "Updating..." : "Adding...") : isEditing ? "Update Expense" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const getCategoryIcon = (category) => {
  const icons = {
    Food: "🍽️",
    Travel: "✈️",
    Rent: "🏠",
    Shopping: "🛍️",
    Others: "📝",
  }
  return icons[category] || "📝"
}

export default AddExpense
