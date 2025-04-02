import Order from "../../models/order.js";
import Branch from "../../models/branch.js";
import { Customer } from "../../models/user.js";

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
