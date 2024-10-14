const cors = require('cors');
const express = require('express');

// routers
const authRouter = require('./routes/auth.router');
const userRouter = require('./routes/user.router');
const clientRouter = require('./routes/client.router');
const mechanicRouter = require('./routes/mechanic.router');
const quoteRouter = require('./routes/quote.router');
const repairShopRouter = require('./routes/repairShop.router');
const repairShopQuoteRouter = require('./routes/repairShopQuote.router')

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//app.use(/routers, router)
app.use('/auth', authRouter);
app.use('/user',userRouter);
app.use('/client', clientRouter);
app.use('/mechanic', mechanicRouter);
app.use('/quote', quoteRouter);
app.use('/repairshop', repairShopRouter);
app.use('/repairshop-quote', repairShopQuoteRouter);

app.get('/',(req, res) => {
    res.json({
        message: "FaiRefac APIv1"
    });
});

module.exports = app;