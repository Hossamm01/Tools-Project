const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('./index.js');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// Home
app.get('/', (req, res) => res.send('Welcome to the Orders API'));

// Orders endpoints
app.get('/orders', db.getOrders);
app.get('/orders/:id', db.getOrderById);
app.post('/orders', db.createOrder);
app.put('/orders/:id/status', db.updateOrderStatus);
app.delete('/orders/:id', db.deleteOrder);

// Courier endpoints
app.get('/couriers/:courierId/orders', db.getOrdersByCourierId);
app.put('/orders/assign', db.assignOrderToCourier);

// User registration with file upload
app.post('/register', upload.single('avatar'), async (req, res) => {
  const { name, email, phone, password } = req.body;
  const avatar = req.file ? req.file.path : null;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await db.createUser({ name, email, password, phone, avatar });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error during registration' });
  }
});

// Start server
app.listen(port, () => console.log(`Server running on port ${port}`));
// 