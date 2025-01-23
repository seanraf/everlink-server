require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const linkRoutes = require("./routes/linkRoutes");
const deploymentHistoryRoutes = require("./routes/deploymentHistoryRoutes");
const crossmintRoutes = require("./routes/crossmintRoutes");
const { handler } = require("./cron");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
); // Enable CORS

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes

app.use("/api/users", userRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/deploymentHistory", deploymentHistoryRoutes);
app.use("/api/crossmint", crossmintRoutes);

app.use("/", (req, res) =>
  res.json({
    message: "Hello World!",
  })
);

// Start the cron job
handler();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
