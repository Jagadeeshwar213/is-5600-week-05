@@ -1,5 +1,6 @@
const path = require('path')
const Products = require('./products')
const Orders = require('./orders')
const autoCatch = require('./lib/auto-catch')

/**
@@ -10,7 +11,6 @@ const autoCatch = require('./lib/auto-catch')
function handleRoot(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
}

/**
 * List all products
 * @param {object} req
@@ -26,24 +26,19 @@ async function listProducts(req, res) {
    tag
  }))
}


/**
 * Get a single product
 * @param {object} req
 * @param {object} res
 */
async function getProduct(req, res, next) {
  const { id } = req.params

  const product = await Products.get(id)
  if (!product) {
    return next()
  }

  return res.json(product)
}

/**
 * Create a product
 * @param {object} req 
@@ -52,6 +47,8 @@ async function getProduct(req, res, next) {
async function createProduct(req, res) {
  console.log('request body:', req.body)
  res.json(req.body)
  const product = await Products.create(req.body)
  res.json(product)
}

/**
@@ -63,6 +60,25 @@ async function createProduct(req, res) {
async function editProduct(req, res, next) {
  console.log(req.body)
  res.json(req.body)
async function editProduct (req, res, next) {
  const change = req.body
  const product = await Products.edit(req.params.id, change)
  res.json(product)
}
/** 
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

async function deleteProduct (req, res, next) {
  const response = await Products.destroy(req.params.id)
  res.json(response)
}

async function createOrder (req, res, next) {
  const orders = await Orders.create(req.body)
  res.json(orders)
}

/**
@@ -73,6 +89,40 @@ async function editProduct(req, res, next) {
 */
async function deleteProduct(req, res, next) {
  res.json({ success: true })
 * List orders
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
*/ 
async function listOrders (req, res, next) {
  const { offset = 0, limit = 25, productId, status } = req.query

  const orders = await Orders.list({ 
    offset: Number(offset), 
    limit: Number(limit),
    productId, 
    status 
  })

  res.json(orders)
}

async function editOrder(req, res, next) {
  try {
    const updatedOrder = await Orders.edit(req.params.id, req.body); // Calls the `edit` method from Orders
    res.json(updatedOrder); // Sends the updated order as JSON
  } catch (error) {
    next(error); // Passes errors to the error-handling middleware
  }
}

async function deleteOrder(req, res, next) {
  try {
    await Orders.destroy(req.params.id); // Calls the `destroy` method from Orders
    res.status(204).send(); // Sends a no-content response
  } catch (error) {
    next(error); // Passes errors to the error-handling middleware
  }
}

module.exports = autoCatch({
@@ -82,4 +132,9 @@ module.exports = autoCatch({
  createProduct,
  editProduct,
  deleteProduct
});
  deleteProduct,
  createOrder,
  listOrders,
  editOrder,
  deleteOrder
});