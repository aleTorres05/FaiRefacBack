const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const mechanicRoutes = require("./routes/mechanicRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const repairShopRoutes = require("./routes/repairShopRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/repairshops", repairShopRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
