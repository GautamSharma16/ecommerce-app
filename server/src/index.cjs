require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");

const connectDB = require("./config/db.cjs");
const errorHandler = require("./middleware/errorHandler.cjs");

const authRoutes = require("./routes/authRoutes.cjs");
const productRoutes = require("./routes/productRoutes.cjs");
const cartRoutes = require("./routes/cartRoutes.cjs");
const wishlistRoutes = require("./routes/wishlistRoutes.cjs");
const orderRoutes = require("./routes/orderRoutes.cjs");
const paymentRoutes = require("./routes/paymentRoutes.cjs");
const reviewRoutes = require("./routes/reviewRoutes.cjs");
const uploadRoutes = require("./routes/uploadRoutes.cjs");
const adminRoutes = require("./routes/adminRoutes.cjs");
const categoryRoutes = require("./routes/categoryRoutes.cjs");
const couponRoutes = require("./routes/couponRoutes.cjs");

// 🔗 Connect DB
connectDB();

const app = express();

// 🛡️ Middlewares
app.use(helmet());
app.use(morgan("dev"));
app.use(mongoSanitize());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🛣️ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/coupons", couponRoutes);

// ❤️ Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ❌ Error handler (LAST me hona chahiye)
app.use(errorHandler);

// 🚀 Server start
const PORT = Number(process.env.PORT || 5000);

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the existing process or change PORT in server/.env`
    );
    process.exit(1);
  }
  console.error("Server failed to start:", err);
  process.exit(1);
});
