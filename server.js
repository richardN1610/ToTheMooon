const express = require('express');
const app = express();
const fs = require('fs');
const cookies = require('cookie-parser');
const { authenicateToken, getUserDetails } = require('./middleware/authenticator');
const jwt = require('jsonwebtoken');
const user = require('./public/user_schema')

app.use(express.json());
app.use(express.static('public'));   //telling server to look at public folder.
app.set('view engine', 'ejs');   //telling app to use ejs as view engine
app.use(express.urlencoded({ extended: false }));
app.use(cookies());

//By creating different routes, the file will be more encapsulated.
const userRoute = require('./public/routes/account');

app.use('/', userRoute);

app.get('*', getUserDetails)

app.get('/home', authenicateToken, (req, res) => {
    res.render('home.ejs');
})
app.get('/search', authenicateToken, (req, res) => {
    res.render('search.ejs')
})

app.post('/search',getUserDetails, authenicateToken, (req, res) => {
    const coinName = req.body.coinName;
    const buyAmount = parseInt(req.body.buyAmount);
    const coinPrice = parseFloat(req.body.coinPrice);

    let currentUser = res.locals.currentUser;
    let newBalance = 0
    if(currentUser.accountBalance > buyAmount){
        newBalance = parseFloat(currentUser.accountBalance -= buyAmount)
        console.log("Purchased")
    }else{
        console.log("not enough money")
    }

    const response = user.collection.updateOne({"_id": currentUser._id},
        {$set:{accountBalance:newBalance},
        $push:{ tradeTransactions:{"_id": currentUser._id,
        "transactionId": 123,
        "coinName" : "BTC",
        "purchasePrice": 86504,
        "purchaseAmount": 1000} }
    })
})

app.listen(3000, () => {
    console.log("Connected to the server")
})