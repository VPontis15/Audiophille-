const express = require('express');
const cors = require('cors');
const pool = require('./config/config');
const env = require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const fs = require('fs');

let products = fs.readFileSync('./data.json', 'utf-8');
products = JSON.parse(products);

// Middleware
app.use(cors());
app.use(express.json());

function getAllProducts(req, res) {
  res
    .status(200)
    .json({ status: 'Success', results: products.length, products });
}

function createProduct(req, res) {
  const newId = products[products.length - 1].id + 1;
  const newProduct = { id: newId, ...req.body };
  fs.writeFileSync('./data.json', JSON.stringify([...products, newProduct]));
  res.status(201).json({ status: 'Success', product: newProduct });
}

function getProduct(req, res) {
  const product = products.find((el) => el.id === +req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ status: 'Fail', message: 'Product not found' });
  }
  res.status(200).json({ status: 'Success', product });
}

function updateProduct(req, res) {
  const product = products.find((el) => el.id === +req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ status: 'Fail', message: 'Product not found' });
  }
  const updatedProduct = { ...product, ...req.body };
  const index = products.indexOf(product);
  products[index] = updatedProduct;
  fs.writeFileSync('./data.json', JSON.stringify(products));
  res.status(200).json({ status: 'Success', product: updatedProduct });
}

function deleteProduct(req, res) {
  const product = products.find((el) => el.id === +req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ status: 'Fail', message: 'Product not found' });
  }
  products = products.filter((el) => el.id !== +req.params.id);
  fs.writeFileSync('./data.json', JSON.stringify(products));
  res.status(204).json({ status: 'Success', product: null });
}

const productRouter = express.Router();
app.use('/api/v1/products', productRouter);

// Routes
productRouter.route('/').get(getAllProducts).post(createProduct);
productRouter
  .route('/:id')
  .get(getProduct)
  .patch(updateProduct)
  .delete(deleteProduct);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
