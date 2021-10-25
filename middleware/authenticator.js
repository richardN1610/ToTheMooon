const jwt = require('jsonwebtoken');
const { find } = require('../public/user_schema');
const user = require('../public/user_schema')
require('dotenv').config({ path: '.env' })
//middleware function to verify user's jwt token
const authenicateToken = (req,res,next)=>{
    const token = req.cookies.accessToken;
    if(!token){
        res.redirect('/')   //if token doesnt exist redirect back to home page
    }else{
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error,decodedToken) =>{
            if(error){
                res.redirect('/')
            }else{
                next(); //if pass go to the next function.
            }
        })
    }
}

const getUserDetails = (req,res,next) =>{
    const token = req.cookies.accessToken;
    if(token){
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err,decodedToken)=>{
            if(err){
                res.locals.currentUser = null;
                next();
            }else{
                let currentUser = await user.findOne({"email" : decodedToken.email}).lean();
                res.locals.currentUser = currentUser;  //using locals to variable accessible from views. 
                next();
            }
        })
    }else{
        res.locals.currentUser = null;
        next();
    }
}


//exporting the constant, so it can be used in other files
module.exports = { authenicateToken, getUserDetails}