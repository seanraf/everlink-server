require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const linkRoutes = require("./routes/linkRoutes");
const DeploymentHistoryRoutes = require("./routes/deploymentHistoryRoutes");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet()); // Adds security headers
app.use(
  cors({
    origin: "*",
  })
); // Enable CORS

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes

app.use("/api/users", userRoutes);
app.use("/api/links", linkRoutes);
app.use("/api/deploymentHistory", DeploymentHistoryRoutes);

app.use("/", (req, res) =>
  res.json({
    message: "Hello World",
  })
);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
