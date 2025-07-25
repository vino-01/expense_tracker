# TrackWise - Smart Expense Tracker

A full-stack expense tracking application built with Node.js, Express, React, and MongoDB Atlas.

## 🚀 Features

- User authentication (signup/login)
- Add, edit, and delete expenses
- Categorize expenses (Food, Travel, Rent, Shopping, Others)
- Expense analytics and charts
- Responsive design
- Data persistence with MongoDB Atlas

## 🛠️ Tech Stack

- **Frontend**: React (CDN), HTML5, CSS3
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS with modern design

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your environment variables:
   ```
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open [http://localhost:5000](http://localhost:5000) in your browser

## 🌐 Deployment

### Environment Variables Required:
- `MONGO_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A secure random string for JWT token signing
- `PORT`: Port number (optional, defaults to 5000)

### Deployment Platforms:
- **Render**: Recommended for easy deployment
- **Railway**: Good alternative with free tier
- **Heroku**: Paid option with good performance
- **Vercel + Railway**: Separate frontend/backend deployment

## 📱 Usage

1. Register a new account or login
2. Add your expenses with amount, category, and notes
3. View your expense history and analytics
4. Edit or delete expenses as needed

## 🔒 Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- CORS enabled for cross-origin requests
- Input validation and sanitization

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
