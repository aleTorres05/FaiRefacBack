const cors = require('cors');
const express = require('express');

// routers
const authRouter = require('./routes/auth.router');
const userRouter = require('./routes/user.router');
const clientRouter = require('./routes/client.router')

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//app.use(/routers, router)
app.use('/auth', authRouter);
app.use('/user',userRouter);
app.use('/client', clientRouter);

app.get('/',(req, res) => {
    res.json({
        message: "FaiRefac APIv1"
    });
});

module.exports = app;