"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import ExpenseChart from "../components/ExpenseChart"
import CategoryChart from "../components/CategoryChart"
import "./Dashboard.css"

const Dashboard = () => {
  const { user } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [stats, setStats] = useState({
    thisMonth: 0,
    thisWeek: 0,
    thisYear: 0,
    totalExpenses: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenses()
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await axios.get("/expenses")
      setExpenses(response.data)
      calculateStats(response.data)
    } catch (error) {
      console.error("Error fetching expenses:", error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (expensesData) => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    const thisWeekStart = new Date(now.setDate(now.getDate() - now.getDay()))

    const stats = expensesData.reduce(
      (acc, expense) => {
        const expenseDate = new Date(expense.date)
        const amount = Number.parseFloat(expense.amount)

        // Total expenses
        acc.totalExpenses += amount

        // This year
        if (expenseDate.getFullYear() === thisYear) {
          acc.thisYear += amount
        }

        // This month
        if (expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear) {
          acc.thisMonth += amount
        }

        // This week
        if (expenseDate >= thisWeekStart) {
          acc.thisWeek += amount
        }

        return acc
      },
      {
        thisMonth: 0,
        thisWeek: 0,
        thisYear: 0,
        totalExpenses: 0,
      },
    )

    setStats(stats)
  }

  const getRecentExpenses = () => {
    return expenses.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-banner">
          <h1>Welcome back, {user?.username}! 👋</h1>
          <p>Here's your expense overview</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>This Month</h3>
            <p className="stat-amount">₹{stats.thisMonth.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>This Week</h3>
            <p className="stat-amount">₹{stats.thisWeek.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>This Year</h3>
            <p className="stat-amount">₹{stats.thisYear.toFixed(2)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💳</div>
          <div className="stat-content">
            <h3>Total Expenses</h3>
            <p className="stat-amount">₹{stats.totalExpenses.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="charts-section">
          <div className="chart-container">
            <h2>Monthly Spending</h2>
            <ExpenseChart expenses={expenses} />
          </div>

          <div className="chart-container">
            <h2>Category Breakdown</h2>
            <CategoryChart expenses={expenses} />
          </div>
        </div>

        <div className="recent-expenses">
          <div className="section-header">
            <h2>Recent Expenses</h2>
            <Link to="/expenses" className="view-all-btn">
              View All
            </Link>
          </div>

          {getRecentExpenses().length > 0 ? (
            <div className="expenses-list">
              {getRecentExpenses().map((expense) => (
                <div key={expense._id} className="expense-item">
                  <div className="expense-category">
                    <span className={`category-icon ${expense.category.toLowerCase()}`}>
                      {getCategoryIcon(expense.category)}
                    </span>
                    <div className="expense-details">
                      <h4>{expense.category}</h4>
                      <p>{expense.note}</p>
                      <small>{new Date(expense.date).toLocaleDateString()}</small>
                    </div>
                  </div>
                  <div className="expense-amount">₹{Number.parseFloat(expense.amount).toFixed(2)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-expenses">
              <p>
                No expenses yet. <Link to="/add-expense">Add your first expense!</Link>
              </p>
            </div>
          )}
        </div>
      </div>

      <Link to="/add-expense" className="fab">
        <span>+</span>
      </Link>
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

export default Dashboard
