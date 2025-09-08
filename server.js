// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/Auth.js');
const taskRoutes = require('./routes/Task.js');

const app = express();

app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://user-frontend-zoss.vercel.app"
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like Postman or server-to-server)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


let cached = global.mongoose; // cached connection

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URL).then(m => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});
connectDB().then(() => console.log('MongoDB connected'));
const PORT = 5000; 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
