const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const {MONGOURI} = require('./keys')

dotenv.config();

mongoose.connect(MONGOURI);
mongoose.connection.on('connected', () => {
    console.log("Connected to database")
})
mongoose.connection.on('err', (err)=> {
    console.log("err connecting", err);
})

require('./models/user');
require('./models/post');

app.use(express.json())
app.use(require("./routes/auth"))
app.use(require("./routes/post"))
app.use(require("./routes/user"))
app.use(require("./routes/payment"))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})