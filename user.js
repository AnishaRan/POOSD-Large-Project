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
        var results = await this.getUserInfo(userId);
        if (results == null) {
            throw new Error('UserId Invalid');
        }
    } catch(e) {
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
        var cookieToken = jwt.sign({ Email : Email}, 'secret');
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

        try {
            const db = client.db("LargeProject");
            const results = await db.collection('Users').find({Login:Login,Password:Password}).toArray();

            var id = -1;
            var fn = '';
            var ln = '';
            var em = '';
            var ver = false;

            if( results.length > 0 )
            {
                id = results[0]._id;
                fn = results[0].FirstName;
                ln = results[0].LastName;
                em = results[0].Email;
                ver = results[0].Verified;
            }
            else
            {
                error = "failed to retrieve information.";
            }
                
            var cookieToken = jwt.sign({ Email:em}, 'secret');
            const result = await db.collection('Users').updateOne({Login:Login,Password:Password}, {$set:{CookieToken:cookieToken}});
            
            if (result.modifiedCount != 1) {
                throw "failed to update cookie token.";
            }

            var ret = {id:id, FirstName:fn, LastName:ln, Email:em, CookieToken:cookieToken,error:error, Verified:ver, succcess: true};
        } catch (e) {
            var ret = {error:e.toString(), success:false};
        }
        res.status(200).json(ret);
    });

    app.post('/user/update', async(req, res, next) =>
    {
        // incoming login, password firstName, LastName, email
        // outgoing login, password firstName, LastName, email

        const {userId, login, password, FirstName, LastName, Email, CookieToken} = req.body;
        const newUser = {
            Login:login,
            Password:password,
            FirstName:FirstName,
            LastName:LastName,
            Email:Email
        };

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
            if (!await this.verifyCookieToken(CookieToken, userId)) {
                throw 'Invalid Cookie Token';
            }

            // update the information in the row of that userID
            const db = client.db("LargeProject");
            const result = await db.collection('Users').updateOne( {"_id" : new mongoose.Types.ObjectId(userId)}, {$set:newUser});
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
        const { login, password, CookieToken } = req.body;

        try
        {
            if (!this.verifyCookieToken(CookieToken, userId)) {
                throw 'Invalid Cookie Token';
            }

            const db = client.db("LargeProject");
            const result = await db.collection('Users').deleteOne({Login:login, Password:password});
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

            error = result.modifiedCount;
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
    
    app.get('/user/getClasses/:userId/:jwt', async(req, res, next) => {
        
        let error = '';
        let success = true;
        const {userId, jwt} = req.params;
        
        console.log(userId);
        
        try {
            if (!this.verifyCookieToken(jwt, userId)) {
                throw 'Invalid Cookie Token';
            }

            const db = client.db("LargeProject");
            const user = await db.collection('Users').findOne({ "_id" : new mongoose.Types.ObjectId(userId)}); 
            
            var currentClasses = user.Classes;
        } catch(e) {
            success = false;
            error = e.toString();
        }
        
        ret = {Success: success, Classes: currentClasses, error: error};
        res.status(200).json(ret);
    });

    app.get('/user/getUser/:userId/:jwt', async(req, res, next) => {
        var error = '';
        var success = true;

        const {userId, jwt} = req.params;

        try {
            if (!this.verifyCookieToken(jwt, userId)) {
                throw 'Invalid Cookie Token';
            }

            var ret = await this.getUserInfo(userId);

            if (ret == null) {
                throw 'Invalid User ID';
            }
        } catch(e) {
            success = false;
            ret = null;
            error = e.toString()
        }

        retObj = {Success: success, User: ret, error: error};
        res.status(200).json(retObj);
    });

    app.post('/user/deleteClass', async(req, res, next) => {
        let error = '';
        let success = true;
        const {Number, userId, CookieToken} = req.body;

        try {
            if (!this.verifyCookieToken(CookieToken, userId)) {
                throw 'Invalid Cookie Token';
            }

            const db = client.db("LargeProject");
            const result = await db.collection('Users').updateOne(
                { "_id" : new mongoose.Types.ObjectId(userId) },
                {$pull:{"Classes": {Number: Number}}});
        } catch(e) {
            success = false;
            error = e.toString();
        }
        
        ret = {Success: success, error: error};
        res.status(200).json(ret);
    });

    app.post('/user/deleteClassTaken', async(req, res, next) => {
        let error = '';
        let success = true;
        const {Number, userId, CookieToken} = req.body;

        try {
            if (!this.verifyCookieToken(CookieToken, userId)) {
                throw 'Invalid Cookie Token';
            }

            const db = client.db("LargeProject");
            const result = await db.collection('Users').updateOne(
                { "_id" : new mongoose.Types.ObjectId(userId) },
                {$pull:{"ClassesTaken": {Number: Number}}});
        } catch(e) {
            success = false;
            error = e.toString();
        }
        
        ret = {Success: success, error: error};
        res.status(200).json(ret);
    });

    app.get('/user/getClassesTaken/:userId/:jwt', async(req, res, next) => {
        
        let error = '';
        let success = true;
        const {userId, jwt} = req.params;
        
        console.log(userId);
        
        try {
            if (!this.verifyCookieToken(jwt, userId)) {
                throw 'Invalid Cookie Token';
            }

            const db = client.db("LargeProject");
            const user = await db.collection('Users').findOne({ "_id" : new mongoose.Types.ObjectId(userId)}); 
            
            var classesTaken = user.ClassesTaken;
        } catch(e) {
            success = false;
            error = e.toString();
        }
        
        ret = {Success: success, ClassesTakenA: classesTaken, error: error};
        res.status(200).json(ret);
    });

    app.post('/user/topoSort', async(req, res, next) => {
    
    
        const {Number, userId, Code} = req.body;
        
        const courseX = Code;
        
        //console.log("This is the course variable value:" + courseX);
        const prerequisites = [['COP3223C','COP2500C'], ['CDA3103C', 'COP3223C'], ['CIS3360', 'COP3223C'], ['COP3502C', 'COP3223C'], ['COP3330', 'COP3223C'], ['COP3503C', 'COP3330'], ['COP3503C', 'COP3502C'], ['COP3503C', 'COT3100C'], ['COP3402', 'CDA3103C'], ['COP3402', 'COP3502C'], ['COP4331C', 'COP3503C'], ['COP4934', 'COP3402'], ['COP4935', 'COP4934'], ['COT4210', 'COP3503C']];
    
        
        function search_2d_array(arr, target) 
        {
            let result = [];
            for (let sub_arr of arr) 
            {
                if (sub_arr.length >= 2 && sub_arr[0] === target)
                {
                    //console.log(sub_arr);
                    result.push(sub_arr);
                }
            }
            //console.log("This is the result value:" + result);
            return result;
        }
    
        
        let error = '';
        let success = true;
    
        //const {Number, userID, Code} = req.body;
    
        try 
        {
            let rem = [];
            let rex = [];
            var rez = [];
            let prereqNow = [];
            
            var course = await Class.findClass(Code, "LEC", "", "", Number, "", null, "", "", "", "");
            //console.log("This is the course:" + Code);
            //console.log(course.length);  
            //var course2 = await Class.findClass(Code, "LAB", "", "", "", "", null, "", "", "", "");
                
            if (course == null || course.length != 1) 
            {
                throw "Invalid Class Info";
            } 
    
            //const Course = course[0];
            //const Course = course.Code;
                
            //console.log("This is the course from Course Value:" + Course);
            const db = client.db("LargeProject");
            const user = await db.collection('Users').findOne({ "_id" : new mongoose.Types.ObjectId(userId)});
    
            var currentClasses = user.ClassesTaken
            var NowClasses = user.Classes
             
                
            //const courses = currentClasses.push(Course);
            //const takenCourses = currentClasses.push(Course);
            
            //console.log("Error is below");
        
            for(var z = 0; z < currentClasses.length; z++)
            {
                //console.log(currentClasses[z].Code);
                //console.log(NowClasses[z].Code);
                rex[z] = currentClasses[z].Code.toString();
            }
            
            
            for(var t = 0; t < NowClasses.length; t++)
            {
                //console.log(NowClasses[t].Code);
                //console.log(NowClasses[z].Code);
                rem[t] = NowClasses[t].Code.toString();
            }
            //console.log(course.Code);
            //console.log(Course);
            //console.log("Why fail now?:" + courseX);
                
                
                
                
            for(var p = 0; p < rem.length; p++)
            {
                rex.push(rem[p]);
            }
                
                
            rex.push(courseX.toString());
                
            //console.log(courseX.toString());
            //console.log("This should be all the prereqs" + rex);
                
            const courses = rex;
            const takenCourses = rex;
                
              
            // Reduces the prereqs to prereqs for the current classes taken to verify the pathing is correct
                
                
            for( let y = 0; y < rex.length; y++)
            {
                rez = search_2d_array(prerequisites, rex[y]);
                //console.log(rez);
                for(let j = 0; j < rez.length; j++)
                {	
                    //console.log(rez[j]);
                    prereqNow.push(rez[j]);
                }
                //prereqNow.push(search_2d_array(prerequisites, takenCourses[y]));
            }
                
            //console.log(rem);
            //console.log(NowClasses[1].Code);
                
            for( var s = 0; s < prereqNow.length; s++)
            {
                if(rem.includes(prereqNow[s][0]) && rem.includes(prereqNow[s][1]))
                {
                    throw "courses not in order";	
                }
            }
                
            //console.log(prereqNow);
            //console.log("This is prereqNow:" + prereqNow);
            const courseGraph = new Map();
            const inDegree = new Map();
    
            //console.log(courses);
            // Initialize courseGraph and inDegree
            for (const courseG of courses) 
            {
                courseGraph.set(courseG, []);
                inDegree.set(courseG, 0);
            }
            
            //console.log("The problem is here");
            // Populate courseGraph and inDegree based on prerequisites
            for (const [courseG, prereq] of prereqNow) 
            {
                //console.log(courseGraph);
                //console.log(courseGraph.get(prereq));
                courseGraph.get(prereq).push(courseG);
                inDegree.set(courseG, inDegree.get(courseG) + 1);
            }
            
            //console.log("The problem is actually here");
            // Perform topological sort
            const queue = [];
            
            for (const [courseG, count] of inDegree.entries()) 
            {
                if (count === 0) 
                {
                    queue.push(courseG);
                }
            }
                
            const sortedCourses = [];
            
            while (queue.length) 
            {
                const currentCourse = queue.shift();
                sortedCourses.push(currentCourse);
    
                for (const nextCourse of courseGraph.get(currentCourse)) 
                {
                    inDegree.set(nextCourse, inDegree.get(nextCourse) - 1);
                    if (inDegree.get(nextCourse) === 0) 
                    {
                        queue.push(nextCourse);
                    }
                }
            }
    
                //const result = await db.collection('Users').updateOne(
                        //{ "_id" : new mongoose.Types.ObjectId(userId) },
                        //{$push:{"Classes": Course}});
            
            
                //return JSON.stringify(sortedCourses) == JSON.stringify(courses);
                //console.log(canCompleteCoursesInOrder(courses, prereqNow)); // Should return true
        }
        // Check if the given order is consistent with the topological sort
        //return JSON.stringify(sortedCourses) === JSON.stringify(courses);
        catch(e)
        {
            success = false;
            error = e.toString();
            
        }
    
        ret = {Success: success, error: error};
        res.status(200).json(ret);
    
        
    });
    
}
