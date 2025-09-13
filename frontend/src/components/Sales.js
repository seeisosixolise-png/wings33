import React, { useState, useEffect } from 'react';
import '../styles/Sales.css';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    items: [{ productId: '', quantity: 1 }]
  });

  useEffect(() => {
    fetchSales();
    fetchProducts();
  }, []);

  const fetchSales = () => {
    fetch('http://localhost:5000/api/sales')
      .then(res => res.json())
      .then(data => setSales(data))
      .catch(err => console.error('Error fetching sales:', err));
  };

  const fetchProducts = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching products:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Safely map items with product details
    const itemsWithDetails = formData.items.map(item => {
      if (!item.productId) {
        console.warn('No product selected for an item');
        return {
          ...item,
          productName: 'Unknown Product',
          unitPrice: 0,
          subtotal: 0
        };
      }

      const product = products.find(p => p.id === item.productId);
      if (!product) {
        console.warn(`Product not found for ID: ${item.productId}`);
        return {
          ...item,
          productName: 'Unknown Product',
          unitPrice: 0,
          subtotal: 0
        };
      }

      return {
        ...item,
        productName: product.name,
        unitPrice: product.price,
        subtotal: product.price * item.quantity
      };
    });

    const totalAmount = itemsWithDetails.reduce((sum, item) => sum + item.subtotal, 0);

    const saleData = {
      customerName: formData.customerName,
      items: itemsWithDetails,
      totalAmount
    };

    fetch('http://localhost:5000/api/sales', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(saleData),
    })
      .then(res => res.json())
      .then(() => {
        setShowForm(false);
        setFormData({
          customerName: '',
          items: [{ productId: '', quantity: 1 }]
        });
        fetchSales();
        fetchProducts(); // Refresh products to update quantities
      })
      .catch(err => console.error('Error recording sale:', err));
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1 }]
    });
  };

  const removeItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  return (
    <div className="sales">
      <div className="page-header">
        <h1>Sales</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          New Sale
        </button>
      </div>

      {showForm && (
        <div className="sale-form">
          <h2>Record New Sale</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Customer Name</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                required
              />
            </div>
            
            <div className="sale-items">
              <h3>Items</h3>
              {formData.items.map((item, index) => (
                <div key={index} className="sale-item">
                  <div className="form-group">
                    <label>Product</label>
                    <select
                      value={item.productId}
                      onChange={(e) => updateItem(index, 'productId', e.target.value)}
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map(product => (
                        <option 
                          key={product.id} 
                          value={product.id}
                          disabled={product.quantity <= 0}
                        >
                          {product.name} {product.quantity <= 0 ? '(Out of Stock)' : `(Available: ${product.quantity})`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      required
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <button 
                      type="button" 
                      className="btn btn-sm btn-delete"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="btn btn-secondary" onClick={addItem}>
                Add Item
              </button>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Record Sale
              </button>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="sales-table">
        <h2>Sales History</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>{new Date(sale.date).toLocaleDateString()}</td>
                <td>{sale.customerName}</td>
                <td>
                  {sale.items.map(item => (
                    <div key={item.productId}>
                      {item.quantity}x {item.productName} (M{item.unitPrice} each)
                    </div>
                  ))}
                </td>
                <td>M{sale.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
