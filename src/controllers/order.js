// import Order from '../schema/Order.js'; // путь к модели Order

// // Get all orders
// export const getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('userId', 'fullname')
//       .populate('productId', 'name price')
//       .populate('categoryId', 'name');

//     const formattedOrders = orders.map(order => ({
//       _id: order._id,
//       user: order.userId?.fullname || 'Unknown User',
//       product: order.productId?.name || 'Unknown Product',
//       category: order.categoryId?.name || 'Unknown Category',
//       quantity: order.quantity,
//       price: order.price,
//       status: order.status,
//       date: order.date,
//       created_at: order.created_at,
//       updated_at: order.updated_at,
//     }));

//     res.status(200).json(formattedOrders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// // Create a new order
// export const createOrder = async (req, res) => {
//   try {
//     const newOrder = new Order(req.body);
//     const savedOrder = await newOrder.save();
//     res.status(201).json(savedOrder);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // Update an existing order
// export const updateOrder = async (req, res) => {
//   try {
//     const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!updatedOrder) return res.status(404).json({ message: 'Order not found' });
//     res.json(updatedOrder);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // Delete an order
// export const deleteOrder = async (req, res) => {
//   try {
//     const deletedOrder = await Order.findByIdAndDelete(req.params.id);
//     if (!deletedOrder) return res.status(404).json({ message: 'Order not found' });
//     res.json({ message: 'Order deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
