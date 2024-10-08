import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Products.module.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({ name: '', price: '', description: '' });
  const limit = 5;

  useEffect(() => {
    axios.get('http://localhost:3000/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching the products:', error);
      });
  }, []);

  const currentProducts = products.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(products.length / limit);

  const nextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const previousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleEditClick = (product) => {
    setEditProductId(product.id);
    setEditedProduct({ name: product.name, price: product.price, description: product.description });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleSave = () => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === editProductId ? { ...product, ...editedProduct } : product
      )
    );
    setEditProductId(null);
  };

  return (
    <>
      <div className={styles.products}>
        <h1>Products</h1>
        <ul className={styles.productList}>
          {currentProducts.map(product => (
            <li key={product.id} className={styles.productItem}>
              {editProductId === product.id ? (
                <div className={styles.editForm}>
                  <input
                    type="text"
                    name="name"
                    value={editedProduct.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className={styles.editInput}
                  />
                  <input
                    type="number"
                    name="price"
                    value={editedProduct.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className={styles.editInput}
                  />
                  <textarea
                    name="description"
                    value={editedProduct.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className={styles.editInput}
                  />
                  <button onClick={handleSave} className={styles.editButton}>Save</button>
                </div>
              ) : (
                <>
                  <h2>{product.name} - ${product.price}</h2>
                  <p>{product.description}</p>
                  <button onClick={() => handleEditClick(product)} className={styles.editButton}>Edit</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.pagination}>
        <button onClick={previousPage} disabled={page === 1} className={styles.paginationButton}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={page === totalPages} className={styles.paginationButton}>
          Next
        </button>
      </div>
    </>
  );
}
