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
const { response } = require('express');

app.use('/', userRoute);

app.get('*', getUserDetails)

app.get('/home', authenicateToken, (req, res) => {
    res.render('home.ejs');
})
app.get('/search', authenicateToken, (req, res) => {
    res.render('search.ejs')
})

app.post('/search', getUserDetails, authenicateToken, async (req, res) => {
    let currentUser = res.locals.currentUser;
    let newBalance = 0
    if (req.body.reqType == "buy") {
        const coinName = req.body.coinName;
        const buyAmount = parseInt(req.body.buyAmount);
        const coinPrice = parseFloat(req.body.coinPrice);
        const timeID = new Date;    //using time as ID to make the ID unique.
        if (currentUser.accountBalance > buyAmount) {
            newBalance = parseFloat(currentUser.accountBalance -= buyAmount)
            res.json({ status: "bought", tradeId: timeID.toLocaleString() })
        } else {
            return res.json({ status: "failed" })
        }

        const response = user.collection.updateOne({ "_id": currentUser._id },
            {
                $set: { accountBalance: newBalance },
                $push: {
                    tradeTransactions: {
                        "transactionId": timeID.toLocaleString(),
                        "coinName": coinName,
                        "purchasePrice": coinPrice,
                        "purchaseAmount": buyAmount
                    }
                }
            })
    }

    if (req.body.reqType == "sell") {
        const transactionID = req.body.selectedID
        const currentPrice = req.body.coinPrice

        const query = user.collection.aggregate([
            { $unwind: "$tradeTransactions" },
            { $match: { "tradeTransactions.transactionId": transactionID } },
            { $replaceRoot: { newRoot: "$tradeTransactions" }},
        ]);
        const result = await query.toArray(); //converting to javascript array
        const saleDifferent = (currentPrice - result[0].purchasePrice).toFixed(2)
        const salePercentage = ((saleDifferent / result[0].purchasePrice*100)/100).toFixed(2);
        const profitLoss = 

        console.log(saleDifferent, salePercentage)
    }


})

app.listen(3000, () => {
    console.log("Connected to the server")
})