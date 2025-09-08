// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/Auth.js');
const taskRoutes = require('./routes/Task.js')
const app = express();

app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://user-frontend-zoss.vercel.app/"], // ✅ allow frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // ✅ allow all methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ allow headers
    credentials: true, // if you use cookies
  })
);

app.use('/api/auth',authRoutes );
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
  const PORT =5000;


  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});