const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const url = 'mongodb+srv://jbenitezconde:WeLoveCOP4331@cluster0.okas9ix.mongodb.net/?retryWrites=true&w=majority';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));

async function findInstructor(fName, lName) {
    var error = '';

    const db = client.db("LargeProject");
    const results = await db.collection('Instructors').find({"FirstName":{$regex:fName+'.*', $options:'r'}, "LastName":{$regex:lName  +'.*', $options:'r'}}).toArray();

    var _ret = [];
    for( var i=0; i<results.length; i++ )
    {
        _ret.push( results[i]);
    }

    return (_ret.length == 0) ? null : _ret;
}

exports.setApp = function ( app, client )
{
    app.post('/instructor/add', async (req, res, next) =>
    {
        // incoming: FirstName, LastName, RMPRating, CurrentClasses, MainOffice
        // outgoing: error
        
        const { FirstName, LastName, RMPRating, CurrentClasses, MainOffice } = req.body;

        const newInstructor = {
            FirstName : FirstName,
            LastName : LastName,
            RMPRating : RMPRating,
            CurrentClasses : CurrentClasses,
            MainOffice : MainOffice
        };

        var error = '';
        
        try
        {
            const db = client.db("LargeProject");
            const result = db.collection('Instructors').insertOne(newInstructor);   
        }
        catch(e)
        {
            error = e.toString();
        }

        instructorList.push( newInstructor );

        var ret = { error: error };
        res.status(200).json(ret);
    });

    app.post('/instructor/find', async (req, res, next) => 
    {
        // incoming: FirstName, LastName
        // outgoing: results[], error

        var error = '';

        const { FirstName, LastName } = req.body;

        var fName = FirstName.trim();
        var lName = LastName.trim();

        try {
            var _ret = await findInstructor(fName, lName);
        } catch (e) {
            error = e.toString();
        }

        var ret = {results:_ret, error:error};
        res.status(200).json(ret);
    });

    app.post('/instructor/delete', async (req, res, next) => {
        // incoming: FirstName, LastName
        // outgoing: error

        var error = '';

        const { FirstName, LastName } = req.body;

        var fName = FirstName.trim();
        var lName = LastName.trim();

        var _ret = await findInstructor(fName, lName);

        if (_ret == null) {
            var ret = {results:null, error:"Instructor not found"};
            res.status(200).json(ret);
        } else {
            try {
                const db = client.db("LargeProject");
                const result = await db.collection('Instructors').deleteOne({"FirstName":fName, "LastName":lName});
            } catch (e) {
                error = e.toString();
                var ret = {results:null, error:error};
                res.status(200).json(ret);
                return;
            }
        }

        _ret = await findInstructor(fName, lName);

        if (_ret == null) {
            var ret = {results:null, error:error};
            res.status(200).json(ret);
        } else {
            var ret = {results:null, error:"Delete failed"};
            res.status(200).json(ret);
        }
    });

    app.post('/instructor/update', async (req, res, next) => {
        // incoming: oFirstName, oLastName, FirstName, LastName, RMPRating, CurrentClasses, MainOffice
        // outgoing: error

        var error = '';

        const {oFirstName, oLastName, FirstName, LastName, RMPRating, CurrentClasses, MainOffice } = req.body;

        var oFName = oFirstName.trim();
        var oLName = oLastName.trim();
        var fName = FirstName.trim();
        var lName = LastName.trim();

        //check for duplicate instructor
        var _ret = await findInstructor(fName, lName);

        if (_ret != null) {
            var ret = {results:null, error:"Invalid Update Fields"};
            res.status(200).json(ret);
            return;
        }
        
        var _ret = await findInstructor(oFName, oLName);
        
        if (_ret == null) {
            var ret = {results:null, error:"Instructor not found"};
            res.status(200).json(ret);
        } else {
            try {
                const db = client.db("LargeProject");
                const result = await db.collection('Instructors').updateOne({"FirstName":oFName, "LastName":oLName}, {$set:{"FirstName":fName, "LastName":lName, "RMPRating":RMPRating, "CurrentClasses":CurrentClasses, "MainOffice":MainOffice}});
            } catch(e) {
                error = e.toString();
            }
        }

        var ret = {results:null, error:''};
        res.status(200).json(ret);
    });
}