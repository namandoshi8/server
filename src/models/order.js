import mongoose from "mongoose";
import Counter from "./counter";

const orderScheme = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  deliveryPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryPartner",
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
    required: true,
  },
  items: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
      },
      count: { type: Number, required: true },
    },
  ],
  deliveryLocation: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: { type: String },
  },
  pickupLocation: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    address: { type: String },
  },
  deliveryPartnerLocation: {
    latitude: {
      type: Number,
      //   required: true,
    },
    longitude: {
      type: Number,
      //   required: true,
    },
    address: { type: String },
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
    enum: [
      "Pending",
      "Accepted",
      "PickedUp",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryFee: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

async function getOrderId(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { name: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  return sequenceDocument.sequence_value;
}

orderScheme.pre("save", async function (next) {
  if ((this, isNew)) {
    const sequenceValue = await getOrderId("order");
    this.orderId = `ORDR${sequenceValue.toString().padStart(5, "0")}`;
  }

  next();
});

const Order = mongoose.model("Order", orderScheme);

export default Order;
