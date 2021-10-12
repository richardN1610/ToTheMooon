const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());
app.use(express.static('public'));   //telling server to look at public folder.
app.set('view engine','ejs');   //telling app to use ejs as view engine

//By creating different routes, the file will be more encapsulated.
const userRoute = require('./public/routes/account');
app.use('/',userRoute);

app.listen(3000, ()=>{
    console.log("Connected to the server")
})