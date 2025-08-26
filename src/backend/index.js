const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const passport = require('passport');
// const session = require('express-session');

// require('./passport');
require('dotenv').config();

const { errorHandler } = require('./errorHandler');

const app = express();
app.use(express.json());

const corsOptions = {
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

// app.use(session({
//     secret: process.env.CLIENT_SECRET,
//     resave: false,
//     saveUninitialized: false
// }));

// app.use(passport.initialize());

// app.use(passport.session());

mongoose.connect(process.env.MONGODB_STRING);
let db = mongoose.connection; 
db.on("error", console.error.bind(console, "connection error"));
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

app.use(errorHandler);

if(require.main === module){
    app.listen(process.env.PORT || 3000, () => console.log(`Server running at port ${process.env.PORT || 3000}`));
}

module.exports = { app, mongoose };