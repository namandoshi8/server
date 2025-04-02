import "dotenv/config";
import fastify from "fastify";
// import fastifySocketIO from "fastify-socket.io";
// import fastifyStatic from "fastify-static";
// import path from "path";
// import { fileURLToPath } from "url";
// import { dirname } from "path";
import connectToDB from "./src/config/connectToDB.js";
import { PORT } from "./src/config/config.js";

async function start() {
  await connectToDB(process.env.MONGO_URI);
  const app = fastify();

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
}

start();
