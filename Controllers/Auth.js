const express = require('express');
const AuthRouter = express.Router();
const validator = require('validator');
const User = require('../Models/User');
const token=require('../private_constants');
const jwt = require('jsonwebtoken');  
const dotenv = require('dotenv');
dotenv.config();            
// const { cleanUpAndValidate } = require('../Utils/AuthUtils');

function generateAccessToken({id}) {
    return jwt.sign(id, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
  }


function cleanUpAndValidate({email, username, phoneNumber, password}) {
    console.log(email, username, phoneNumber, password);
    return new Promise((resolve, reject) => {
        if(typeof(email) !== "string") {
            
            return reject("Email is not string");
           
        }

        if(!validator.isEmail(email)) {
            return reject("Invalid Email");
        }

        if(username.length < 3) {
            return reject("Username too short");
        }

        if(username.length > 30) {
            return reject("Username too long");
        }

        if(phoneNumber && phoneNumber.length !== 10) {
            return reject("Phone number not valid");
        }

        if(password && password < 6) {
            return reject("Password too short");
        }

        if(password && !validator.isAlphanumeric(password)) {
            return reject("Password should contain alphabet and numbers");
        }

        return resolve();
    });
}



AuthRouter.post('/register', async (req, res) => {

    const { email, username, password, name, phoneNumber, profilePic } = req.body;

    // Validate data
    cleanUpAndValidate({email, username, phoneNumber, password}).then(async () => {

        // Validate if user is already registered
        try {
            await User.verifyUsernameAndEmailExists({username, email});
        }
        catch(err) {
            return res.send({
                status: 401,
                message: "Error Occured",
                error: err
            })
        }

        // Save the data in db

        const user = new User( { email, username, password, name, phoneNumber, profilePic } );

        try {
            const dbUser = await user.registerUser();

            // Newletter, Welcome email

            return res.send({
                status: 200,
                message: "Registration Successfull",
                data: dbUser
            })
        }
        catch(err) {
            
            return res.send({
                status: 401,
                message: "Internal error",
                error: err
            })
        }

    }).catch((err) => {
        return res.send({
            status: 400,
            message: "Invalid Data",
            error: err
        })
    })
})

AuthRouter.post('/login', async (req, res) => {
    const { loginId, password } = req.body;

    if(!loginId || !password) {
        return res.send({
            status: 401,
            message: "Invalid Credentials"
        })
    }
    
    try {
        const dbUser = await User.loginUser({loginId, password});

        req.session.isAuth = true;
        req.session.userId=dbUser._id;
        // console.log(dbUser);
        req.session.user = {
            userId: dbUser._id,
            email: dbUser.email,
            username: dbUser.username, 
            name: dbUser.name
        };
        // res.cookie(dbUser._id, dbUser.username, {signed: true});
        // req.session.user.save();
        // console.log(req.session.user);


        return res.send({
            status: 200,
            message: "Login Successful",
            data: dbUser
        })
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Error Occured",
            error: err 
        })
    }
})

AuthRouter.post('/user',async(req,res)=>{
    const{offset}=req.body;
    console.log(req.session);
try{
    
    const users=await User.getUsers({offset});
    res.send({
        status:200,
        message:"user fetch successful",
        data:users
    })
}
catch(err)
{
    res.send({
        status:404,
        message:"error in fething users",
        error:err
    })
}
})

module.exports = AuthRouter;