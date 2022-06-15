require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 5050;
const CLIENT = process.env.CLIENT || '*';
const DATABASE = process.env.DATABASE;

const corsOptions ={
    origin: CLIENT, 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

app.use(bodyParser.json());

app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.json({ message: "welecome to fakepng api backend", contact: "contact@fakepng.com" })
});

app.use('/user', require('./routes/user'));
app.use('/schedule', require('./routes/schedule'));
app.use('/homework', require('./routes/homework'));

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to Database 💽");
}).catch((err) => {
    console.log(err)
});