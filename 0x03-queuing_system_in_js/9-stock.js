import { createClient } from 'redis';
import express from 'express';
import { promisify } from 'util';

const client = createClient();
const app = express();

client.on('error', (err) => console.error('Redis Client Error:', err));
client.on('connect', () => console.log('Connected to Redis successfully'));

const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

const getItemById = (id) => {
  for (const product of listProducts) {
    if (product.id === id) {
      return product;
    }
  }
  return null;
};

const reserveStockById = async (itemId, stock) => {
  try {
    const setAsync = promisify(client.set).bind(client);
    await setAsync(`item.${itemId}`, stock);
  } catch (err) {
    console.error(`Error reserving stock for item ${itemId}:`, err);
  }
};

const getCurrentReservedStockById = async (itemId) => {
  try {
    const getAsync = promisify(client.get).bind(client);
    const stock = await getAsync(`item.${itemId}`);
    return stock; 
  } catch (err) {
    console.error(`Error reserving stock for item ${itemId}:`, err);
    return null;
  }
};

app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  const currentQuantity = currentStock !== null ?
		          parseInt(currentStock, 10)
		          : product.stock;

  res.json({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
    currentQuantity: currentQuantity,
  });

});

app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId, 10);
  const product = getItemById(itemId);

  if (!product) {
    return res.status(404).json({ status: 'Product not found' });
  }

  const currentStock = await getCurrentReservedStockById(itemId);
  let currentQuantity = currentStock !== null ?
                        parseInt(currentStock, 10) :
                        product.stock;

  if (currentQuantity <= 0) {
    return res.status(400).json({
      status: 'Not enough stock available',
      itemId: itemId,
    });
  }

  currentQuantity -= 1;
  await reserveStockById(itemId, currentQuantity);

  res.json({
    status: 'Reservation confirmed',
    itemId: itemId,
  });

});

app.listen(1245);
