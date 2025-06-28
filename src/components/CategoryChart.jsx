import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

const CategoryChart = ({ expenses }) => {
  const getCategoryData = () => {
    const categoryData = {}

    expenses.forEach((expense) => {
      const category = expense.category
      categoryData[category] = (categoryData[category] || 0) + Number.parseFloat(expense.amount)
    })

    return Object.entries(categoryData).map(([category, amount]) => ({
      name: category,
      value: Number.parseFloat(amount.toFixed(2)),
      icon: getCategoryIcon(category),
    }))
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

  const data = getCategoryData()

  const COLORS = ["#3A0CA3", "#F72585", "#4CC9F0", "#7209B7", "#560BAD"]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">
            {data.icon} {data.name}
          </p>
          <p className="tooltip-value">Amount: ₹{data.value.toFixed(2)}</p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null // Don't show label for slices less than 5%

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  if (data.length === 0) {
    return (
      <div className="chart-wrapper">
        <div className="no-data">
          <p>No expense data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={CustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(value, entry) => `${entry.payload.icon} ${value}`} wrapperStyle={{ fontSize: "14px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryChart
