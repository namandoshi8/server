import { Customer, DeliveryPartner, Admin } from "../../models/user.js";

export async function UpdateUser(req, reply) {
  try {
    const { userId } = req.user;
    const updateData = req.body;

    let user =
      (await Customer.findById(userId)) ||
      (await DeliveryPartner.findById(userId)) ||
      (await Admin.findById(userId));
    if (!user) {
      return reply.status(401).send({ error: "User not found" });
    }

    let userModel;

    if (user.role === "Customer") {
      userModel = Customer;
    } else if (user.role === "DeliveryPartner") {
      userModel = DeliveryPartner;
    } else if (user.role === "Admin") {
      userModel = Admin;
    } else {
      return reply.status(403).send({ error: "Invalid role" });
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );
    return reply.send({
      message: "User Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}
