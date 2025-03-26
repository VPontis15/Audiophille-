const fs = require('fs');
const products = require('../data.json');

exports.getAllProducts = function (req, res) {
  res
    .status(200)
    .json({ status: 'Success', results: products.length, products });
};

exports.createProduct = function (req, res) {
  const newId = products[products.length - 1].id + 1;
  const newProduct = { id: newId, ...req.body };
  fs.writeFileSync('./data.json', JSON.stringify([...products, newProduct]));
  res.status(201).json({ status: 'Success', product: newProduct });
};

exports.getProduct = function (req, res) {
  const product = products.find((el) => el.id === +req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ status: 'Fail', message: 'Product not found' });
  }
  res.status(200).json({ status: 'Success', product });
};

exports.updateProduct = function (req, res) {
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
};
exports.deleteProduct = function (req, res) {
  const product = products.find((el) => el.id === +req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ status: 'Fail', message: 'Product not found' });
  }

  const index = products.indexOf(product);
  products.splice(index, 1);
  fs.writeFileSync('./data.json', JSON.stringify(products));
  res.status(204).json({ status: 'Success', product: null });
};
