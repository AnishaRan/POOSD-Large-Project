const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Class = require('./class.js');
const Email = require('./email.js');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const url = 'mongodb+srv://jbenitezconde:WeLoveCOP4331@cluster0.okas9ix.mongodb.net/?retryWrites=true&w=majority';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("User.js:\t\tmongodb connected"));

exports.verifyCookieToken = async function (token, userId) {
    var error = '';

    try {
        const db = client.db("LargeProject");
        var results = await db.collection('Users').findOne({"_id" : new mongoose.Types.ObjectId(userId)}).toArray();
    } catch(e) {
        error = e.toSrting();
        return false;
    }

    return (results.CookieToken == token);
}

exports.getUserInfo = async function ( userId ) {
    var error = '';

    try {
        const db = client.db("LargeProject");
        const results = await db.collection('Users').find({"_id" : new mongoose.Types.ObjectId(userId)}).toArray();

        var _ret = [];
        for( var i=0; i<results.length; i++ )
        {
            _ret.push( results[i]);
        }

        if (results.length != 1) {
            throw new Error('UserId Invalid');
        }
        return _ret[0];
    } catch(e) {
        console.log("Error: '" + e + "' in getUserInfo()");
        return null;
    }
}

exports.setApp = function ( app, client ) {
    app.post('/user/verify', async (req, res, next) => {
        var err = '';

        const { userKey, userId } = req.body;

        try {
            let user = await this.getUserInfo( userId );

            // Check if the user exists and there are no duplicates
            if (user == null) {
                err = 'UserId Invalid';
                throw new Error(err);
            } else {
                // Check if the user is already verified
                if ( user.Verified ) {
                    err = 'User Already Verified';
                    throw new Error(err);
                }
                
                // Check if the user's verification key is correct
                if (userKey != user.VerKey) {
                    err = 'Incorrect Verification Key';
                    throw new Error(err);
                }
                
                // Update the user's verification key to null
                const db = client.db("LargeProject");
                const result = await db.collection('Users').updateOne(
                                        { "_id" : new mongoose.Types.ObjectId(userId) },
                                        {$set:{"VerKey": "", "Verified": true}});
                
                err = 'User Verified';
                var ret = { Success: true, error: err };
                res.status(200).json(ret);

            }
        } catch (e) {
            var ret = { error: err };
            res.status(200).json(ret);
        }
    });

    app.post('/user/register', async(req, res, next) =>{
        // incoming login, password FirstName, LastName, email
        // outgoing new  id, error

        const {login, password, FirstName, LastName, Email} = req.body;
        var cookieToken = Email.makeToken(20);
        const newUser = {Login: login, Password: password, FirstName: FirstName, LastName: LastName, Email: Email, VerKey:'', Verified:false, CookieToken:cookieToken};
        let error = '';
        let success = true;
        let newID = -1;
        let insertedUser;

        try
        {
            const database = client.db("LargeProject");
            const result = await database.collection('Users').insertOne(newUser);
            newID = result.insertedId;
            insertedUser = result;
        }
        catch(e)
        {
            success = false;
            error = e.toString();
            //await client.close();
        }

        // send return to front end
        let ret = {Success: success, User: insertedUser, error: error};
        res.status(200).json(ret);
    });

    app.post('/user/login', async (req, res, next) => {
        // incoming: login, password
        // outgoing: id, firstName, lastName, error
            
        let error = '';

        const { Login, Password } = req.body;

        const db = client.db("LargeProject");
        const results = await db.collection('Users').find({Login:Login,Password:Password}).toArray();

        var id = -1;
        var fn = '';
        var ln = '';
        var em = '';

        if( results.length > 0 )
        {
            id = results[0]._id;
            fn = results[0].FirstName;
            ln = results[0].LastName;
            em = results[0].Email;
        }
        else
        {
            error = "failed to retrieve information.";
        }
            
        var cookieToken = jwt.sign({ Email:em}, 'secret');
        var ret = {id:id, FirstName:fn, LastName:ln, Email:em, CookieToken:cookieToken,error:error};    
        res.status(200).json(ret);
    });

    app.post('/api/updateUser', async(req, res, next) =>
    {
        // incoming login, password firstName, LastName, email
        // outgoing login, password firstName, LastName, email

        const {userId, login, password, FirstName, LastName, Email, CookieToken} = req.body;
        const newUser = {Login:login, Password:password, FirstName:FirstName, LastName:LastName, Email:Email};
        let error = '';
        let success = true;

        let fn = '';
        let ln = '';
        let un = '';
        let pw = '';
        let em = '';
        let id = '';
        try
        {
            if (!this.verifyCookieToken(CookieToken, userId)) {
                throw 'Invalid Cookie Token';
            }

            // update the information in the row of that userID
            const db = client.db("LargeProject");
            const result = await db.collection('Users').updateOne( {Login:login}, {$set:newUser});
            // now double check that user got updated              
            const newRes = await db.collection('Users').find(newUser).toArray();
            if(newRes.length > 0)
            {
            un = newRes[0].Login;
            pw = newRes[0].Password              
            fn = newRes[0].FirstName;
            ln = newRes[0].LastName;
            em = newRes[0].Email;
            id = newRes[0]._id;
            }
        }
        catch(e)
        {
            success = false;
            error = e.toString();
        }

        // send return to front end
        let ret = {Success:success, ID:id, Login:un, Password:pw, FirstName:fn,
            LastName:ln, Email:em, error: error};
        res.status(200).json(ret);
    });

    app.post('/api/deleteUser', async(req, res, next) =>
    {
        // incoming login, password
        // outgoing error code
        let error = '';
        let success = true;
        const { login, password } = req.body;

        try
        {
            const db = client.db("LargeProject");
            const result = await db.collection('Users').deleteOne({Login:login});
        }
        catch(e)
        {
            success = false;
            error = e.toString();
        }

        let ret = {Success: success, error: error};
        res.status(200).json(ret);
    });

    app.post ('/user/addClass', async(req, res, next) => {
        let error = '';
        let success = true;
        const {Number, userId, CookieToken} = req.body;

        try {
            if (!this.verifyCookieToken(CookieToken, userId)) {
                throw 'Invalid Cookie Token';
            }

            var course = await Class.findClass("", "", "", "", Number, "", null, "", "", "", "");
            
            if (course == null || course.length != 1) {
                throw "Invalid Class Info";
            }

            const Course = course[0];

            const db = client.db("LargeProject");
            const user = await db.collection('Users').findOne({ "_id" : new mongoose.Types.ObjectId(userId)}); 
            
            var currentClasses = user.Classes;
            console.log(currentClasses);

            for (var i = 0; i < currentClasses.length; i++) {
                if (currentClasses[i].Number == Number) {
                    throw "Class Already Added";
                }
            }

            const result = await db.collection('Users').updateOne(
                { "_id" : new mongoose.Types.ObjectId(userId) },
                {$push:{"Classes": Course}});
        } catch(e) {
            success = false;
            error = e.toString();
        }
        
        ret = {Success: success, error: error};
        res.status(200).json(ret);
    });

    app.post ('/user/addClassTaken', async(req, res, next) => {
        let error = '';
        let success = true;
        const {Number, userId, CookieToken} = req.body;

        try {
            // if (!this.verifyCookieToken(CookieToken, userId)) {
            //     throw 'Invalid Cookie Token';
            // }

            var course = await Class.findClass("", "", "", "", Number, "", null, "", "", "", "");
            
            if (course == null || course.length != 1) {
                throw "Invalid Class Info";
            }

            const Course = course[0];

            const db = client.db("LargeProject");
            const user = await db.collection('Users').findOne({ "_id" : new mongoose.Types.ObjectId(userId)}); 
            
            var currentClasses = user.ClassesTaken

            for (var i = 0; currentClasses != null && i < currentClasses.length; i++) {
                if (currentClasses[i].Number == Number) {
                    throw "Class Already Added";
                }
            }

            const result = await db.collection('Users').updateOne(
                { "_id" : new mongoose.Types.ObjectId(userId) },
                {$push:{"ClassesTaken": Course}});
        } catch(e) {
            success = false;
            error = e.toString();
        }
        
        ret = {Success: success, error: error};
        res.status(200).json(ret);
    });
}