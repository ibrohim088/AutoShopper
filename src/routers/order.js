// routes/orderRouter.js
import express from 'express';
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from '../controllers/order.js';

const router = express.Router();

router.get('/order', getOrders);
router.post('/order', createOrder);
router.put('/order/:id', updateOrder);
router.delete('/order/:id', deleteOrder);

export default router;
