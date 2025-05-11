// import mongoose from "mongoose";

// const { Schema, model, Types } = mongoose;

// const orderSchema = new Schema(
//   {
//     products: [
//       {
//         productId: {
//           type: Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         name: {
//           type: String,
//           required: true,
//         },
//         description: {
//           type: String,
//           required: true,
//         },
//         image: {
//           type: String,
//           required: true,
//         },
//       //   price: {
//       //     type: Number,
//       //     required: true,
//       //   },
//         // quantity: {
//         //   type: Number,
//         //   required: true,
//         //   min: [1, "Quantity must be at least 1"],
//         // },
//       },
//     ],
//     totalPrice: {
//       type: Number,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: {
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//     },
//     versionKey: false,
//   }
// );

// const Order = model("Order", orderSchema);

// export default Order;


import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        categoryId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        status: {
          type: String,
          enum: ["Pending", "Processing", "Delivered"],
          default: "Pending",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        price: {
          type: Number,
          ref: "Product",
          required: true,
        },
      },
   {
      versionKey: false,
      timestamps: {
         createdAt: "created_at",
         updatedAt: "updated_at",
      },
   }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;