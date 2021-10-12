const mongoose = require('mongoose');
const dbUrl = "mongodb+srv://admin:admin@userdetails.fao6f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority" ;


const connectDB = async ()=>{
   await mongoose.connect(dbUrl,{useNewUrlParser: true, useUnifiedTopology: true}).then((result) =>{
        console.log("Connected to the database")
}).catch((err) =>{
    console.log(err);
})
}

module.exports = connectDB; //exporting the const