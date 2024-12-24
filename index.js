const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Feature #1: User Registration
app.post('/register', async (req, res) => {
    const { name, email, phone_number, password } = req.body;
    try {
        const user = await db.findUserByEmail(email);
        if (user.length > 0) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }
        const newUser = await db.createUser({ name, email, phone_number, password });
        res.status(201).json({ message: 'User registered successfully', data: newUser });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Feature #2: User Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.findUserByEmail(email);
        if (!user.length || !await bcrypt.compare(password, user[0].password)) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        res.json({ message: 'Login successful', userId: user[0].uid });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

app.get('/users', async (req, res) => {
  try {
      const users = await db.getUsers();
      res.json(users);
  } catch (error) {
      console.error('Error fetching users:', error.message);
      res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Feature #3: Create Order
app.post('/order', async (req, res) => {
  const { pickuplocation, dropofflocation, details, courierid, userid, status } = req.body;
  try {
      const newOrder = await db.createOrder({ pickuplocation, dropofflocation, details, courierid, userid, status });
      res.status(201).json({ message: 'Order created successfully', data: newOrder });
  } catch (error) {
      console.error('Error creating order:', error.message);
      res.status(500).json({ error: 'Failed to create order' });
  }
});

// Feature #5: Fetch My Orders
app.get('/my-orders/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    try {
        const orders = await db.getOrdersByUserId(userId);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error.message);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Feature #6: Fetch Order Details
app.get('/order/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const order = await db.getOrderById(id);
        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error.message);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// Feature #8: Update Order Status
app.put('/order/:id/status', async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;

  try {
      const updatedOrder = await db.updateOrderStatus(id, status);
      if (!updatedOrder) {
          return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ message: 'Order status updated successfully', data: updatedOrder });
  } catch (error) {
      console.error('Error updating order status:', error.message);
      res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Feature #10: Assign Orders to Courier
app.post('/order/assign', async (req, res) => {
    const { orderId, courierId } = req.body;

    try {
        const assignedOrder = await db.assignOrderToCourier(orderId, courierId);
        if (!assignedOrder) {
            return res.status(404).json({ error: 'Order not found or already assigned' });
        }
        res.json({ message: 'Order assigned to courier successfully', data: assignedOrder });
    } catch (error) {
        console.error('Error assigning order to courier:', error.message);
        res.status(500).json({ error: 'Failed to assign order to courier' });
    }
});

// Feature #11: Fetch All Orders Assigned to a Specific Courier
app.get('/orders/courier/:courierId', async (req, res) => {
  const courierId = parseInt(req.params.courierId);
  try {
      const orders = await db.getOrdersByCourierId(courierId);
      res.json(orders);
  } catch (error) {
      console.error('Error fetching orders for courier:', error.message);
      res.status(500).json({ error: 'Failed to fetch orders for courier' });
  }
});

// Feature #12: Fetch All Orders 
app.get('/orders', async (req, res) => {
  try {
      const orders = await db.getAllOrders();
      res.json(orders);
  } catch (error) {
      console.error('Error fetching all orders:', error.message);
      res.status(500).json({ error: 'Failed to fetch all orders' });
  }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
// 