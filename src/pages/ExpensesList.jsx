"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import "./ExpensesList.css"

const ExpensesList = () => {
  const navigate = useNavigate()
  const [expenses, setExpenses] = useState([])
  const [filteredExpenses, setFilteredExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: "",
    month: "",
    year: new Date().getFullYear().toString(),
    startDate: "",
    endDate: "",
  })

  const categories = ["Food", "Travel", "Rent", "Shopping", "Others"]

  useEffect(() => {
    fetchExpenses()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [expenses, filters])

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("/expenses")
      setExpenses(response.data)
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...expenses]

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((expense) => expense.category === filters.category)
    }

    // Date range filter
    if (filters.startDate && filters.endDate) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date)
        const startDate = new Date(filters.startDate)
        const endDate = new Date(filters.endDate)
        return expenseDate >= startDate && expenseDate <= endDate
      })
    }

    // Month filter
    if (filters.month) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === Number.parseInt(filters.month)
      })
    }

    // Year filter
    if (filters.year) {
      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getFullYear() === Number.parseInt(filters.year)
      })
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date))

    setFilteredExpenses(filtered)
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: "",
      month: "",
      year: new Date().getFullYear().toString(),
      startDate: "",
      endDate: "",
    })
  }

  const handleEdit = (id) => {
    navigate(`/edit-expense/${id}`)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await axios.delete(`/expenses/${id}`)
        setExpenses((prev) => prev.filter((expense) => expense._id !== id))
      } catch (error) {
        console.error("Error deleting expense:", error)
        alert("Failed to delete expense. Please try again.")
      }
    }
  }

  const getTotalAmount = () => {
    return filteredExpenses.reduce((total, expense) => total + Number.parseFloat(expense.amount), 0)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading expenses...</p>
      </div>
    )
  }

  return (
    <div className="expenses-list">
      <div className="expenses-header">
        <h1>Your Expenses</h1>
        <Link to="/add-expense" className="btn-primary">
          Add New Expense
        </Link>
      </div>

      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Category</label>
            <select name="category" value={filters.category} onChange={handleFilterChange} className="filter-input">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {getCategoryIcon(category)} {category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Month</label>
            <select name="month" value={filters.month} onChange={handleFilterChange} className="filter-input">
              <option value="">All Months</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2024, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Year</label>
            <select name="year" value={filters.year} onChange={handleFilterChange} className="filter-input">
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() - i
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              })}
            </select>
          </div>

          <div className="filter-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="filter-input"
            />
          </div>

          <div className="filter-actions">
            <button onClick={clearFilters} className="btn-secondary">
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="expenses-summary">
        <div className="summary-card">
          <h3>Total: ₹{getTotalAmount().toFixed(2)}</h3>
          <p>
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {filteredExpenses.length > 0 ? (
        <div className="expenses-grid">
          {filteredExpenses.map((expense) => (
            <div key={expense._id} className="expense-card">
              <div className="expense-header">
                <div className="expense-category">
                  <span className={`category-icon ${expense.category.toLowerCase()}`}>
                    {getCategoryIcon(expense.category)}
                  </span>
                  <div>
                    <h3>{expense.category}</h3>
                    <p className="expense-date">
                      {new Date(expense.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="expense-amount">₹{Number.parseFloat(expense.amount).toFixed(2)}</div>
              </div>

              {expense.note && (
                <div className="expense-note">
                  <p>{expense.note}</p>
                </div>
              )}

              <div className="expense-actions">
                <button onClick={() => handleEdit(expense._id)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(expense._id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-expenses">
          <div className="no-expenses-content">
            <h3>No expenses found</h3>
            <p>Try adjusting your filters or add a new expense.</p>
            <Link to="/add-expense" className="btn-primary">
              Add Your First Expense
            </Link>
          </div>
        </div>
      )}
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

export default ExpensesList
