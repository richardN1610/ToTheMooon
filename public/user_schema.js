const mongoose = require('mongoose');

const tradeTransactionsSchema = mongoose.Schema({
    transactionID:{
        type: String
    },
    coinName:{
        type: String
    },
    purchasePrice:{ //price of the coin when it was purchased
        type: Number
    },
    purchaseAmount:{    //how much money the user spent
        type: Number
    }
})

//creating user model
const user = mongoose.Schema({
    fullname:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    },
    mobile:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    accountBalance:{
        type: Number
    },
    // using one to many schema 
    tradeTransactions:{
        tradeTransactionsSchema
    }
})



module.exports = User = mongoose.model('User', user)    //exporting user model so it can be used in other files