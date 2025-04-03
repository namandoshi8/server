import Order from "../../models/order.js";
import Branch from "../../models/branch.js";
import { Customer, DeliveryPartner } from "../../models/user.js";

export async function createOrder(req, reply) {
  try {
    const { userId } = req.user;
    const { items, branch, totalPrice } = req.body;

    const customerData = await Customer.findById(userId);
    const branchData = await Branch.findById(branch);

    if (!customerData || !branchData) {
      return reply.status(400).send({ error: "Customer or Branch not found" });
    }

    const order = new Order({
      customer: userId,

      items: items.map((item) => ({
        id: item.id,
        item: item.item,
        count: item.count,
      })),
      totalPrice,
      branch,
      deliveryLocation: {
        latitude: customerData.liveLocation.latitude,
        longitude: customerData.liveLocation.longitude,
        address: customerData.address || "No Address",
      },
      pickupLocation: {
        latitude: branchData.location.latitude,
        longitude: branchData.location.longitude,
        address: branchData.address || "No Address",
      },
    });

    await order.save();

    return reply.send({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ error: error.message, message: "Failed to create order" });
  }
}

export async function confirmOrder(req, reply) {
  try {
    const { orderId } = req.params;
    const { userId } = req.user;
    const { deliveryPersonLocation } = req.body;

    const deliveryPerson = await DeliveryPartner.findById(userId);

    if (!deliveryPerson) {
      return reply.status(400).send({ error: "Delivery Person not found" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return reply.status(400).send({ error: "Order not found" });
    }

    if (order.status !== "Pending") {
      return reply.status(400).send({ error: "Order already confirmed" });
    }

    order.status = "Accepted";
    order.deliveryPartner = userId;
    order.deliveryPartnerLocation = {
      latitude: deliveryPersonLocation?.latitude,
      longitude: deliveryPersonLocation?.longitude,
      address: deliveryPerson.address || "No Address",
    };

    req.server.io.to(orderId).emit("orderAccepted", order);

    await order.save();

    return reply.send({
      message: "Order Confirmed!",
      order,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ error: error.message, message: "Failed to confirm order" });
  }
}

export async function updateOrder(req, reply) {
  try {
    const { orderId } = req.params;
    const { status, deliveryPartnerLocation } = req.body;
    const { userId } = req.user;

    const deliveryPerson = await DeliveryPartner.findById(userId);

    if (!deliveryPerson) {
      return reply.status(404).send({ error: "Delivery Person not found" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return reply.status(404).send({ error: "Order not found" });
    }

    if (["Deliverd", "Cancelled"].includes(order.status)) {
      return reply.status(400).send({ error: "Order cannot be updated" });
    }

    if (order.deliveryPartner.toString() !== userId) {
      return reply
        .status(403)
        .send({ error: "You are not authorized to update this order" });
    }

    order.status = status;
    order.deliveryPartnerLocation = deliveryPartnerLocation;

    await order.save();

    req.server.io.to(orderId).emit("LiveTrackingUpdates", order);

    return reply.send({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    return reply
      .status(500)
      .send({ error: error.message, message: "Failed to update order" });
  }
}

export async function getAllOrders(req, reply) {
  try {
    const { status, customerId, DeliveryPartnerId, branch } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (customerId) {
      query.customer = customerId;
    }
    if (DeliveryPartnerId) {
      query.deliveryPartner = DeliveryPartnerId;
      query.branch = branch;
    }

    const orders = await Order.find(query).populate(
      "customer branch items.item deliveryPartner"
    );

    return reply.send(orders);
  } catch (error) {
    return reply
      .status(500)
      .send({ error: error.message, message: "Failed to fetch orders" });
  }
}

export async function getOrderById(req, reply) {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate(
      "customer branch items.item deliveryPartner"
    );

    if (!order) {
      return reply.status(404).send({ error: "Order not found" });
    }

    return reply.send(order);
  } catch (error) {
    return reply
      .status(500)
      .send({ error: error.message, message: "Failed to fetch order" });
  }
}
