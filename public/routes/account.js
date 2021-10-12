const express = require('express');
const user = require('../user_schema');
const mongodbConnection = require('../db_connection');
const bcrypt = require('bcrypt');
const passport = require('passport');
const initPassport = require('../passport');
const { findOne } = require('../user_schema');
const router = express.Router();


router.use(express.json());
router.use(express.urlencoded({ extended: false }));
mongodbConnection();

router.get('/', (req, res) => {
    res.render('index.ejs');
})

router.post('/', async (req, res) => {
    if (req.body.reqType == "sign-up") {
            //creating user account
    const password = await bcrypt.hash(req.body.password, 10);
        try {
            const response = await user.create({    //creating user account in the database
                fullname: req.body.fullName,
                password: password,
                mobile: req.body.mobile,
                email: req.body.email
            })
        } catch (error) {
            if (error)
                return res.json({ status: 'error', error: 'Username already in use' })
            throw error
        }
        return res.json({ status: 'ok' })
    } 
    
    if(req.body.reqType == "login") {
        const loginID = req.body.loginEmail;
        const loginPW = req.body.loginPassword;
        const response = await user.findOne({"email" : loginID}).lean();    //finding user by email
        console.log(loginID)
        console.log(response)
        // if(!response){
        //     return res.json({status: 'No ID Found', error:'Invalid Credentials'})
        // }
        if(response){
            if(await bcrypt.compare(loginPW, response.password)){
                return res.json({status: 'ok'})
            }else{
                return res.json({status: 'No ID Found', error:'Invalid Credentials'})
            }
        }
    }
})

module.exports = router //exporting router so it can be used in server.js