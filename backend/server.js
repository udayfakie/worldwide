import express from "express";
import data from "./data.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import seedRouter from "./routes/seedRouter.js";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRoutes.js";
import OrderRouter from "./routes/OrderRouter.js";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();
app.use(cors());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/api/keys/paypal", (req, res) => {
//   res.send(process.env.PAYPAL_CLIENT_ID || "sb");
// });

app.use("/api/seed", seedRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", OrderRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

//serving the frontend
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, "../frontend/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});
app.use(express.static(path.join(__dirname, "../frontend/public")));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`server at ${port}`);
});
