import React, { useState } from 'react';
import './AddProductForm.css';
import axios from 'axios';

const AddProductForm = () => {
  const [productName, setProductName] = useState('');
  const [cost, setCost] = useState('');
  const [size, setSize] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!productName || !cost || cost <= 0) {
      setError('Please provide a valid product name and positive cost.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/products', {
        name: productName,
        cost: parseFloat(cost),
        size,
        description
      });

      console.log('Product added:', response.data);
      setProductName('');
      setCost('');
      setSize('');
      setDescription('');
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.response && error.response.status === 409) {
        setError('Product name already exists.');
      } else {
        setError('Failed to add product. Please try again.');
      }
    }
  };

  return (
    <div>
      <div className="header-title">Eco Wear</div> {/* Company name at top center */}
      <form onSubmit={handleSubmit} className="form-container">
        <label className="form-label">Product Name:</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="form-input"
          required
        />

        <label className="form-label">Cost:</label>
        <input
          type="number"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          className="form-input"
          required
        />

        <label className="form-label">Size:</label>
        <input
          type="text"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="form-input"
        />

        <label className="form-label">Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
          rows="3"
        ></textarea>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" className="form-button">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;
