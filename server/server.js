const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5000;
// Going to have to change the port to 4280 later but for now 5000 should work
// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hello123', 
    database: 'ecowear_db'
    /* I am running this locally so for test you must create a local db and make sure
    that the password matches the one I have here */
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// POST /api/products - Add a new product with description
app.post('/api/products', (req, res) => {
    const { name, cost, size, description } = req.body; // Include description

    // Log the request body
    console.log('Received product:', req.body);

    const checkQuery = 'SELECT * FROM products WHERE LOWER(name) = LOWER(?)';
    db.query(checkQuery, [name], (checkError, checkResults) => {
        if (checkError) {
            console.error('Error checking product name:', checkError);
            return res.status(500).json({ error: 'Database error' });
        }

        if (checkResults.length > 0) {
            return res.status(409).json({ error: 'Product name must be unique' });
        }

        // Updated insert query to include description
        const insertQuery = 'INSERT INTO products (name, cost, size, description) VALUES (?, ?, ?, ?)';
        db.query(insertQuery, [name, cost, size, description], (insertError, insertResults) => {
            if (insertError) {
                console.error('Error inserting product:', insertError);
                return res.status(500).json({ error: 'Database error' });
            }

            console.log('Product added successfully:', { id: insertResults.insertId, name, cost, size, description });
            res.status(201).json({ message: 'Product added successfully', productId: insertResults.insertId });
        });
    });
});

// GET /api/products - Retrieve all products
app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching products:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
