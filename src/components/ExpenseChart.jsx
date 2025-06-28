import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const ExpenseChart = ({ expenses }) => {
  const getMonthlyData = () => {
    const monthlyData = {}
    const currentYear = new Date().getFullYear()

    // Initialize all months with 0
    for (let i = 0; i < 12; i++) {
      const monthName = new Date(currentYear, i).toLocaleString("default", { month: "short" })
      monthlyData[monthName] = 0
    }

    // Aggregate expenses by month
    expenses.forEach((expense) => {
      const date = new Date(expense.date)
      if (date.getFullYear() === currentYear) {
        const monthName = date.toLocaleString("default", { month: "short" })
        monthlyData[monthName] += Number.parseFloat(expense.amount)
      }
    })

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount: Number.parseFloat(amount.toFixed(2)),
    }))
  }

  const data = getMonthlyData()

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">Amount: ₹{payload[0].value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="month" stroke="#666" fontSize={12} />
          <YAxis stroke="#666" fontSize={12} tickFormatter={(value) => `₹${value}`} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="amount" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A0CA3" />
              <stop offset="100%" stopColor="#F72585" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ExpenseChart
