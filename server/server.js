const dotenv = require("dotenv");
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

// Route imports
const userRoutes = require("./routes/userRoutes");
const problemRoutes = require("./routes/problemRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const testCaseRoutes = require("./routes/testCaseRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/testcases", testCaseRoutes);
app.use("/api/analytics", analyticsRoutes);

// health check
app.get("/", (req, res) => res.json({ message: "ErrorLens API is running. " }));

// 404 handler
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Route not found" }),
);

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, message: err.message || "Internal server error" });
});

// start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`SERVER CONNECTED SUCCESSFULLY.... AT PORT ${PORT}`),
);
