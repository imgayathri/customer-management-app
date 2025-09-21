const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const customerRoutes = require("./routes/customerRoutes");
const addressRoutes = require("./routes/addressRoutes");

app.use("/api/customers", customerRoutes);
app.use("/api/addresses", addressRoutes);

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
