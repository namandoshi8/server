import "dotenv/config";
import connectToDB from "./src/config/connectToDB.js";
import { PORT } from "./src/config/config.js";
import fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import { registerRoutes } from "./src/routes/index.js";
// import fastifyStatic from "fastify-static";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";

async function start() {
  await connectToDB(process.env.MONGO_URI);
  const app = fastify();

  app.register(fastifySocketIO, {
    cors: { origin: "*" },
    pingInterval: 1000,
    pingTimeout: 5000,
    transports: ["websocket"],
  });

  await registerRoutes(app);

  app.listen(
    {
      port: PORT,
      host: "0.0.0.0",
    },
    (err, address) => {
      if (err) {
        console.error(err);
        // process.exit(1);
      }
      console.log(
        `Server listening at ${address} or https://localhost:${PORT}`
      );
    }
  );

  app.ready().then(() => {
    app.io.on("connection", (socket) => {
      console.log("a user connected");

      socket.on("joinRoom", (orderId) => {
        socket.join(orderId);
        console.log(`user joined room ${orderId}`);
      });

      socket.on("disconnect", () => {
        console.log("a user disconnected");
      });
    });
  });
}

start();
