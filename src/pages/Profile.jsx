"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import axios from "axios"
import "./Profile.css"

const Profile = () => {
  const { user, logout } = useAuth()
  const [expenses, setExpenses] = useState([])
  const [stats, setStats] = useState({
    totalExpenses: 0,
    totalAmount: 0,
    mostFrequentCategory: "",
    longestStreak: 0,
    averageDaily: 0,
  })
  const [loading, setLoading] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

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
    if (expensesData.length === 0) {
      setStats({
        totalExpenses: 0,
        totalAmount: 0,
        mostFrequentCategory: "None",
        longestStreak: 0,
        averageDaily: 0,
      })
      return
    }

    // Total expenses and amount
    const totalExpenses = expensesData.length
    const totalAmount = expensesData.reduce((sum, expense) => sum + Number.parseFloat(expense.amount), 0)

    // Most frequent category
    const categoryCount = expensesData.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + 1
      return acc
    }, {})
    const mostFrequentCategory = Object.keys(categoryCount).reduce((a, b) =>
      categoryCount[a] > categoryCount[b] ? a : b,
    )

    // Calculate longest streak
    const sortedExpenses = expensesData.map((expense) => new Date(expense.date)).sort((a, b) => a - b)

    let longestStreak = 1
    let currentStreak = 1

    for (let i = 1; i < sortedExpenses.length; i++) {
      const diffTime = Math.abs(sortedExpenses[i] - sortedExpenses[i - 1])
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= 1) {
        currentStreak++
      } else {
        longestStreak = Math.max(longestStreak, currentStreak)
        currentStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, currentStreak)

    // Average daily spending (based on days with expenses)
    const uniqueDays = new Set(expensesData.map((expense) => new Date(expense.date).toDateString())).size
    const averageDaily = totalAmount / uniqueDays

    setStats({
      totalExpenses,
      totalAmount,
      mostFrequentCategory,
      longestStreak: sortedExpenses.length > 0 ? longestStreak : 0,
      averageDaily: isNaN(averageDaily) ? 0 : averageDaily,
    })
  }

  const handleDeleteAccount = async () => {
    try {
      await axios.delete("/auth/user")
      logout()
    } catch (error) {
      console.error("Error deleting account:", error)
      alert("Failed to delete account. Please try again.")
    }
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">{user?.username?.charAt(0).toUpperCase()}</div>
          <div className="profile-info">
            <h1>{user?.username}</h1>
            <p>{user?.email}</p>
            <small>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</small>
          </div>
        </div>

        <div className="profile-stats">
          <h2>Your Expense Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Amount</h3>
                <p className="stat-value">₹{stats.totalAmount.toFixed(2)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Total Expenses</h3>
                <p className="stat-value">{stats.totalExpenses}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">{getCategoryIcon(stats.mostFrequentCategory)}</div>
              <div className="stat-content">
                <h3>Top Category</h3>
                <p className="stat-value">{stats.mostFrequentCategory}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-content">
                <h3>Longest Streak</h3>
                <p className="stat-value">{stats.longestStreak} days</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-content">
                <h3>Daily Average</h3>
                <p className="stat-value">₹{stats.averageDaily.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <h2>Account Actions</h2>
          <div className="actions-grid">
            <button onClick={logout} className="btn-secondary">
              Logout
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="btn-danger">
              Delete Account
            </button>
          </div>
        </div>

        {showDeleteConfirm && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Delete Account</h3>
              <p>
                Are you sure you want to delete your account? This action cannot be undone and will permanently delete
                all your expenses.
              </p>
              <div className="modal-actions">
                <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleDeleteAccount} className="btn-danger">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
