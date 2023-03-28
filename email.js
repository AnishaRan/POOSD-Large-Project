const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const User = require('./user.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const url = 'mongodb+srv://jbenitezconde:WeLoveCOP4331@cluster0.okas9ix.mongodb.net/?retryWrites=true&w=majority';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("Email.js:\t\tmongodb connected"));

const userName = 'uactuallycanfinish';  
const email = userName + '@outlook.com';

async function tokensender (user, tok) {
    const transporter = nodemailer.createTransport ({
        service: "hotmail",
        auth: {
            user: email, // email
            pass: "WeLoveCOP4331" // password
        }
    });

    
    // const token = jwt.sign(
    //     {
    //         data: userId, 
    //     }, "ourSecurityKey", {epiresIn: "10m"}
    // );
    console.log(user);
    const mailConfigurations = {
        from: email, // my email
        to: user.Email, // user email
        subject: "Email Verification",
        text: `Hi ${user.FirstName} ${user.LastName},\n\nPlease click on the following link to verify your email address:\nhttp://localhost:5000/email/verify/${user._id}/${tok}\n\nThank you,\nUCanActuallyFinish}`
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);
        console.log("Email Sent Successfully");
    });
}

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    
    return result;
}

exports.setApp = function ( app, client ) {
    app.post('/email/sendverification', async (req, res, next) => {

        const { userId } = req.body;

        try {
            var user = await User.getUserInfo(userId);

            if (user == null) {
                throw new Error('UserId Invalid');
            }

            console.log("User: " + user.Email);

            var verificationString = makeid(20);
            const db = client.db("LargeProject");
            db.collection('Users').updateOne({"_id" : new mongoose.Types.ObjectId(userId)}, {$set: {"VerKey": verificationString}});

            await tokensender(user, verificationString);

            res.status(200).json({err : 'Email Sent Successfully'});
        } catch (e) {
            console.log("Error: '" + e + "' in email/sendverification");
            res.status(200).json({err : 'Email Not Sent Successfully'});
        }
    });

    app.get('/email/verify/:userId/:token', async (req, res, next) => {
        const token = req.params.token;
        const userId = req.params.userId;

        try {
            var user = await User.getUserInfo(userId);

            if (user == null) {
                throw new Error('UserId Invalid');
            }

            if (user.VerKey == token) {
                const db = client.db("LargeProject");
                db.collection('Users').updateOne({"_id" : new mongoose.Types.ObjectId(userId)}, {$set: {"Verified": true}});
                res.status(200).json({err : 'Email Verified Successfully'});
            } else {
                res.status(200).json({err : 'Email Not Verified Successfully'});
            }
        } catch (e) {
            console.log("Error: '" + e + "' in getUserInfo()");
            res.status(200).json({err : 'Email Not Verified Successfully'});
        }
    });
}