const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// In-memory data
// --------------------
let products = [
  { id: 1, name: "Coffee", price: 20, quantity: 50 },
  { id: 2, name: "Tea", price: 15, quantity: 30 },
];

let customers = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890", createdAt: new Date() },
  { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321", createdAt: new Date() },
];

let sales = []; // For storing sales

// --------------------
// Product routes
// --------------------

// Get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Add a product
app.post("/api/products", (req, res) => {
  const newProduct = { id: Date.now(), ...req.body };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update a product
app.put("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === productId);
  if (index === -1) return res.status(404).json({ error: "Product not found" });
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

// Delete a product
app.delete("/api/products/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  products = products.filter(p => p.id !== productId);
  res.json({ message: "Deleted successfully" });
});

// --------------------
// Customer routes
// --------------------

// Get all customers
app.get("/api/customers", (req, res) => {
  res.json(customers);
});

// Add a new customer
app.post("/api/customers", (req, res) => {
  const newCustomer = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date()
  };
  customers.push(newCustomer);
  res.status(201).json(newCustomer);
});

// --------------------
// Sales routes
// --------------------

// Get all sales
app.get("/api/sales", (req, res) => {
  res.json(sales);
});

// Add a new sale
app.post("/api/sales", (req, res) => {
  const sale = {
    id: Date.now(),
    ...req.body,
    date: new Date()
  };

  // Update product quantities
  sale.items.forEach(item => {
    const product = products.find(p => p.id === parseInt(item.productId));
    if (product) product.quantity -= item.quantity;
  });

  sales.push(sale);
  res.status(201).json(sale);
});

// --------------------
// Dashboard route
// --------------------
app.get("/api/dashboard", (req, res) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity <= 10).length;
  const totalSales = sales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalCustomers = customers.length;
  res.json({ totalProducts, lowStockProducts, totalSales, totalCustomers });
});

// --------------------
// Start server
// --------------------
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
