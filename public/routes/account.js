require('dotenv').config({ path: '.env' })
const express = require('express');
const user = require('../user_schema');
const mongodbConnection = require('../db_connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.ACCESS_TOKEN_SECRET;
const { findOne } = require('../user_schema');
const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
mongodbConnection();

router.get('/', (req, res) => {
    res.render('index.ejs');
})

router.post('/', async (req, res) => {
    if (req.body.reqType == "sign-up") {
        const password = await bcrypt.hash(req.body.password, 10);
        try {
            const response = await user.create({    //creating user account in the database
                fullname: req.body.fullName,
                password: password,
                mobile: req.body.mobile,
                email: req.body.email,
                accountBalance: 1000000 //when new user sign up, they get 1,000,000 dollars money to trade.
            })
        } catch (error) {
            console.log(error)
            if (error)
                return res.json({ status: 'error', error: 'Username already in use' })
            throw error
        }
        return res.json({ status: 'ok' })
    }

    if (req.body.reqType == "login") {
        const loginID = req.body.loginEmail;
        const loginPW = req.body.loginPassword;
        const response = await user.findOne({ "email": loginID }).lean();    //finding user by email

        if (!response) {
            return res.json({ status: 'No ID Found', error: 'Invalid Credentials' })
        }
        if (response) {
            if (await bcrypt.compare(loginPW, response.password)) {
                const accessToken = jwt.sign({
                    email: response.email
                }, jwtSecret)
                // return res.json({accessToken: accessToken});
                res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 60 * 60 * 1000 * 24 })
                res.json({ status: 'ok' });
            } else {
                return res.json({ status: 'error', error: 'Invalid Credentials' })
            }
        }
    }

    if (req.body.reqType == "logout") {
        res.cookie('accessToken', ' ', { maxAge: 1 });
        res.json({status:"logged-out"})
    }
})


module.exports = router //exporting router so it can be used in server.js