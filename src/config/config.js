import fastifySession from "@fastify/session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { Admin } from "../models/user.js";

export const PORT = process.env.PORT || 3001;
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;

const MongoDBStore = ConnectMongoDBSession(fastifySession);

export const sessionStore = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

sessionStore.on("error", function (error) {
  console.log("Session Store Error", error);
});

export async function authenticate(email, password) {
  //   if (email && password) {
  //     if (email === "admin@namandoshi.in" && password === "admin") {
  //       return Promise.resolve({ email: email, password: password });
  //     } else {
  //       return false;
  //     }
  //   }

  if (email && password) {
    const user = await Admin.findOne({ email });
    if (!user) {
      return false;
    }
    if (user.password === password) {
      return Promise.resolve({ email: email, password: password });
    } else {
      return false;
    }
  }
}

// export const sessionConfig = {
//   secret: COOKIE_PASSWORD,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false,
//     sameSite: true,
//     maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
//   },
//   store: sessionStore,
// };
