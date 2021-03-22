const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const questionRoutes = require('./routes/question-routes');
const answerRoutes = require("./routes/answer-routes");
const userRoutes = require("./routes/user-routes");
const HttpError = require("./util/http-error-message");

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());


app.use((req,res,next) => {
    // Header used to patch the backend with Frontend
    // It will allow the access form any browser NOT ONLY localhost:3000
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/user',userRoutes);

app.use('/api/question',questionRoutes);

app.use('/api/answer',answerRoutes);

// If any of the routes were not found
app.use((req,res,next) => {
    next(new HttpError("Could not find the route!",404));
})

// For sending Error messages
app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({message:error.message || "Something went wrong"});
})


mongoose
    .connect("mongodb+srv://innoventx:innoventx123@cluster0.humw3.mongodb.net/portal?retryWrites=true&w=majority",{ useUnifiedTopology: true , useNewUrlParser: true })
    .then(() => {
        app.listen(5000,function(){
            console.log("Server listening on Port 5000");
        });        
    })
    .catch((err) => {
        console.log(err);
    });
