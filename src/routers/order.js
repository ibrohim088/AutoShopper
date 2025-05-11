import express from "express";
import Order from "../schema/Order.js";
import Product from "../schema/Product.js";
import Category from "../schema/Category.js";
import User from "../schema/User.js";

const router = express.Router();

// Получить все заказы
router.get("/order", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "-password") // исключаем пароль
      .populate("productId")
      .populate("categoryId");

    res.status(200).send({ data: orders });
  } catch (error) {
    res.status(500).send({ error: "Ошибка сервера: " + error.message });
  }
});

// Получить заказ по ID
router.get("/order/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "-password")
      .populate("productId")
      .populate("categoryId");

    if (!order) {
      return res.status(404).send({ message: "Заказ не найден" });
    }

    res.status(200).send({ data: order });
  } catch (error) {
    res.status(500).send({ error: "Ошибка сервера: " + error.message });
  }
});

// Создать новый заказ
router.post("/order", async (req, res) => {
  try {
    const { userId, productId, categoryId, quantity } = req.body;

    console.log("Данные заказа:", req.body);

    // Проверка на обязательные поля
    if (!userId || !productId || !categoryId || !quantity) {
      return res.status(400).send({ message: "Все поля обязательны" });
    }

    // Проверка наличия связанных документов
    const [user, product, category] = await Promise.all([
      User.findById(userId),
      Product.findById(productId),
      Category.findById(categoryId),
    ]);

    if (!user) return res.status(404).send({ message: "Пользователь не найден" });
    if (!product) return res.status(404).send({ message: "Товар не найден" });
    if (!category) return res.status(404).send({ message: "Категория не найдена" });

    // Расчёт цены
    const price = product.price * quantity;

    // Создание заказа
    const newOrder = new Order({
      userId,
      productId,
      categoryId,
      quantity,
      price,
    });

    await newOrder.save();

    res.status(201).send({ data: newOrder });
  } catch (error) {
    console.error("Ошибка при создании заказа:", error);
    res.status(500).send({ error: "Ошибка сервера: " + error.message });
  }
});

// Обновить статус заказа
router.patch("/order/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Processing", "Delivered"];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).send({ message: "Неверный или отсутствующий статус" });
    }

    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).send({ message: "Заказ не найден" });
    }

    res.status(200).send({ data: updated });
  } catch (error) {
    res.status(500).send({ error: "Ошибка сервера: " + error.message });
  }
});

// Удалить заказ
router.delete("/order/:id", async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).send({ message: "Заказ не найден" });
    }

    res.status(200).send({ message: "Заказ удалён", data: deleted });
  } catch (error) {
    res.status(500).send({ error: "Ошибка сервера: " + error.message });
  }
});

export default router;
