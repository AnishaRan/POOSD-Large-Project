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

async function tokensender (user, tok, message) {
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
        text: `Hi ${user.FirstName} ${user.LastName},\n` + message
    };

    transporter.sendMail(mailConfigurations, function (error, info) {
        if (error) throw Error(error);
        console.log("Email Sent Successfully");
    });
}

exports.makeToken = function (length) {
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

        var error = '';
        var success = true;

        try {
            var user = await User.getUserInfo(userId);

            if (user == null) {
                throw new Error('UserId Invalid');
            }

            console.log("User: " + user.Email);

            var verificationString = this.makeToken(20);
            const db = client.db("LargeProject");
            db.collection('Users').updateOne({"_id" : new mongoose.Types.ObjectId(userId)}, {$set: {"VerKey": verificationString}});

            const message = `Please click on the following link to verify your email address:\nhttps://cop4331-ucaf1.herokuapp.com/email/verify/${user._id}/${verificationString}\n\nThank you,\nU Actually Can Finish`;

            await tokensender(user, verificationString, message);
        } catch (e) {
            error = e.toString();
            success = false;
        }

        res.status(200).json({Success: success, err : error});
    });

    app.post('/email/passwordreset', async (req, res, next) => {
        const { Email } = req.body;
        
        var error = '';
        var success = true;

        try {
            var user = null;

            const db = client.db("LargeProject");
            const result = await db.collection('Users').find({Email:Email}).toArray();

            var ret = [];
            for (let i = 0; i < result.length; i++) {
                ret.push(result[i]);
            }

            if (ret.length == 0) {
                throw new Error('Email Invalid');
            }

            user = ret[0];

            if (user == null) {
                user = null;
                throw new Error('Email Invalid');
            }

            if (user.Verified != true) {
                throw new Error('User Not Verified');
            }

            var verificationString = this.makeToken(6);
            db.collection('Users').updateOne({"_id" : new mongoose.Types.ObjectId(user._id)}, {$set: {"VerKey": verificationString}});

            const message = `Please use the following code to reset your password:\n\n${verificationString}\n\nIf you did not expect this email please ignore it.\n\nThank you,\nU Actually Can Finish`;

            await tokensender(user, verificationString, message);
        } catch (e) {
            error = e.toString();
            success = false;
        }

        res.status(200).json({Success: success, user:user, err : error,  token: verificationString});

    });

    app.get('/email/verify/:userId/:token', async (req, res, next) => {
        const token = req.params.token;
        const userId = req.params.userId;

        var error = '';
        var success = true;

        try {
            var user = await User.getUserInfo(userId);

            if (user == null) {
                throw new Error('UserId Invalid');
            }

            if (user.VerKey == token) {
                const db = client.db("LargeProject");
                db.collection('Users').updateOne({"_id" : new mongoose.Types.ObjectId(userId)}, {$set: {"Verified": true}});
            } else {
                throw 'Token Invalid';
            }
        } catch (e) {
            error = e.toString();
            success = false;
        }

        res.status(200).json({Success: success, err : error});
    });
}