import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProductManagement from './components/ProductManagement';
import Sales from './components/Sales';
import Inventory from './components/Inventory';
import Customers from './components/Customers';
import Reporting from './components/Reporting';
import Header from './components/Header';
import './App.css';

function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [products, setProducts] = useState([]);

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error loading products:", err));
  }, []);

  return (
    <Router>
      <div className="app">
        {/* Header now contains navigation */}
        <Header activeModule={activeModule} setActiveModule={setActiveModule} />

        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard products={products} />} />
            <Route path="/products" element={<ProductManagement products={products} />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/reporting" element={<Reporting />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
