const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const questionRoutes = require('./routes/question-routes');
const answerRoutes = require("./routes/answer-routes");
const userRoutes = require("./routes/user-routes");
const HttpError = require("./util/http-error-message");

app.use(bodyParser.json());

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
    })
