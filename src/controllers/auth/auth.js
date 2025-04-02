import { Customer, DeliveryPartner, Admin } from "../../models/user.js";
import jwt from "jsonwebtoken";

function generateToken(user) {
  const token = jwt.sign(
    { userid: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const refreshToken = jwt.sign(
    { userid: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return { token, refreshToken };
}

export async function loginCustomer(req, reply) {
  try {
    const { phone } = req.body;
    let customer = await Customer.findOne({ phone });

    if (!customer) {
      customer = new Customer({
        phone,
        role: "Customer",
        isActivated: true,
      });
      await customer.save();
    }

    const { token, refreshToken } = generateToken(customer);

    return reply.send({
      message: customer
        ? "Login Successfull"
        : "Customer Created and Logged In",
      token,
      refreshToken,
      customer,
    });
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function loginDeliveryPartner(req, reply) {
  try {
    const { email, password } = req.body;
    let deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
      return reply.status(400).send({
        message: "Delivery Partner not found",
      });
    }

    if (deliveryPartner.password !== password) {
      return reply.status(400).send({
        message: "Incorrect Credentials",
      });
    }

    const { token, refreshToken } = generateToken(deliveryPartner);

    return reply.send({
      message: deliveryPartner
        ? "Login Successfull"
        : "Delivery Partner Created and Logged In",
      token,
      refreshToken,
      deliveryPartner,
    });
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function refreshToken(req, reply) {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return reply.status(401).send({ error: "Refresh token not found" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    let user;

    if (decoded.role === "Customer") {
      user = await Customer.findById(decoded.userid);
    } else if (decoded.role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(decoded.userid);
    } else if (decoded.role === "Admin") {
      user = await Admin.findById(decoded.userid);
    } else {
      return reply.status(403).send({ error: "Invalid role" });
    }

    if (!user) {
      return reply.status(401).send({ error: "User not found" });
    }
    const { token, refreshToken: newRefreshToken } = generateToken(user);

    return reply.send({
      message: "Token Refreshed Successfully",
      token,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}

export async function fetchUser(req, reply) {
  try {
    const { userid, role } = req.user;
    let user;
    if (role === "Customer") {
      user = await Customer.findById(userid);
    } else if (role === "DeliveryPartner") {
      user = await DeliveryPartner.findById(userid);
    } else if (role === "Admin") {
      user = await Admin.findById(userid);
    } else {
      return reply.status(403).send({ error: "Invalid role" });
    }
    if (!user) {
      return reply.status(401).send({ error: "User not found" });
    }
    return reply.send({ message: "User Fetched Successfully", user });
  } catch (error) {
    return reply.status(500).send({ error: error.message });
  }
}
