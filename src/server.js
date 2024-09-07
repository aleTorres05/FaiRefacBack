const cors = require('cors');
const express = require('express');

// routers
const userRouter = require('./routes/user.router')

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//app.use(/routers, router)
app.use('/user',userRouter);

app.get('/',(req, res) => {
    res.json({
        message: "FaiRefac APIv1"
    });
});

module.exports = app;