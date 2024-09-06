const cors = require('cors');
const express = require('express');

// routers

const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//app.use(/routers, router)


app.get('/',(req, res) => {
    res.json({
        message: "FaiRefac APIv1"
    });
});

module.exports = app;