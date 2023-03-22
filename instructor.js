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
            // console.log(newInstructor);
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

    app.get('/instructor/list', async (req, res, next) => {
        var ret = instructorList;

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

        var _ret = await findInstructor(fName, lName);

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
            const db = client.db("LargeProject");
            const result = await db.collection('Instructors').deleteOne({"FirstName":fName, "LastName":lName});
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
