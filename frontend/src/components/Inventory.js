import React, { useState, useEffect } from 'react';
import '../styles/Inventory.css';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLowStockProducts(data.filter(p => p.quantity <= (p.lowStockThreshold || 5)));
      })
      .catch(err => console.error('Error fetching inventory:', err));
  };

  const updateStock = (productId, newQuantity) => {
    fetch(`http://localhost:5000/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: parseInt(newQuantity) }),
    })
      .then(() => {
        fetchInventory();
      })
      .catch(err => console.error('Error updating stock:', err));
  };

  return (
    <div className="inventory">
      <h1>Inventory Management</h1>
      
      {lowStockProducts.length > 0 && (
        <div className="alert alert-warning">
          <h3>Low Stock Alert</h3>
          <p>The following products are running low on stock:</p>
          <ul>
            {lowStockProducts.map(product => (
              <li key={product.id}>
                {product.name} - Only {product.quantity} left
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="inventory-table">
        <h2>Current Inventory</h2>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Low Stock Threshold</th>
              <th>Status</th>
              <th>Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} className={product.quantity <= (product.lowStockThreshold || 5) ? 'low-stock' : ''}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>{product.lowStockThreshold || 5}</td>
                <td>
                  <span className={`status ${product.quantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    defaultValue={product.quantity}
                    onBlur={(e) => updateStock(product.id, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;