const cors = require("cors");
const express = require("express");
const path = require("path");

// routers
const authRouter = require("./routes/auth.router");
const userRouter = require("./routes/user.router");
const clientRouter = require("./routes/client.router");
const mechanicRouter = require("./routes/mechanic.router");
const quoteRouter = require("./routes/quote.router");
const repairShopRouter = require("./routes/repairShop.router");
const repairShopQuoteRouter = require("./routes/repairShopQuote.router");
const carRouter = require("./routes/car.router");

const app = express();

//middlewares
app.use(cors());
app.use((req, res, next) => {
  if (req.originalUrl === "/quote/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

//app.use(/routers, router)
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/client", clientRouter);
app.use("/mechanic", mechanicRouter);
app.use("/quote", quoteRouter);
app.use("/repairshop", repairShopRouter);
app.use("/repairshop-quote", repairShopQuoteRouter);
app.use("/car", carRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

module.exports = app;
