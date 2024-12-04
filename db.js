const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Set up PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'tools3',
    password: 'moaaz', // Update this with the correct password
    port: 5432,
});

// Test the database connection
pool.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Connected to PostgreSQL');
    }
});

// User functions
const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    return result.rows;
};

const createUser = async ({ name, email, phone_number, password }) => {
    const result = await pool.query(
        'INSERT INTO "User" (name, email, phone_number, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, phone_number, password]
    );
    return result.rows[0];
};

const getUsers = async () => {
    const result = await pool.query('SELECT * FROM "User"');
    return result.rows;
};

// Order functions
const createOrder = async ({ pickuplocation, dropofflocation, details, courierid, userid, status = 'pending' }) => {
    const result = await pool.query(
        'INSERT INTO "Orders" (pickuplocation, dropofflocation, details, courierid, userid, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [pickuplocation, dropofflocation, details, courierid, userid, status]
    );
    return result.rows[0];
};

const getOrdersByUserId = async (userid) => {
    const result = await pool.query('SELECT * FROM "Orders" WHERE userid = $1', [userid]);
    return result.rows;
};

const getOrderById = async (id) => {
    const result = await pool.query('SELECT * FROM "Orders" WHERE id = $1', [id]);
    return result.rows[0];
};

const updateOrderStatus = async (id, status) => {
    const result = await pool.query(
        'UPDATE "Orders" SET status = $1 WHERE id = $2 RETURNING *',
        [status, id]
    );
    return result.rows[0];
};

const assignOrderToCourier = async (orderId, courierId) => {
    const result = await pool.query(
        'UPDATE "Orders" SET courierid = $1 WHERE id = $2 AND courierid IS NULL RETURNING *',
        [courierId, orderId]
    );
    return result.rows[0];
};

// Courier functions
const getOrdersByCourierId = async (courierId) => {
    const result = await pool.query('SELECT * FROM "Orders" WHERE courierid = $1', [courierId]);
    return result.rows;
};

// Admin functions
const getAllOrders = async () => {
    const result = await pool.query('SELECT * FROM "Orders"');
    return result.rows;
};

module.exports = {
    findUserByEmail,
    createUser,
    createOrder,
    getOrdersByUserId,
    getOrderById,
    updateOrderStatus,
    assignOrderToCourier,
    getOrdersByCourierId,
    getAllOrders,
    getUsers
};