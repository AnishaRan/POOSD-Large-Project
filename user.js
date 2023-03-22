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

exports.setApp = function ( app, client ) {
    app.post('/user/register', async(req, res, next) =>{
        // incoming login, password FirstName, LastName, email
        // outgoing new  id, error

        const {login, password, FirstName, LastName, Email} = req.body;
        const newUser = {Login: login, Password: password, FirstName: FirstName, LastName: LastName, Email: Email};
        let error = '';
        let newID = -1;

        try
        {
            const database = client.db("LargeProject");
            const result = await database.collection('Users').insertOne(newUser);
            newID = result.insertedId;
        }
        catch(e)
        {
            error = e.toString();
            //await client.close();
        }

        // send return to front end
        let ret = {ID: newID, error: error};
        res.status(200).json(ret);
    });

    app.post('/user/login', async (req, res, next) => {
        // incoming: login, password
        // outgoing: id, firstName, lastName, error
            
        let error = '';

        const { login, password } = req.body;

        const db = client.db("LargeProject");
        const results = await db.collection('Users').find({Login:login,Password:password}).toArray();

        var id = -1;
        var fn = '';
        var ln = '';

        if( results.length > 0 )
        {
        id = results[0]._id;
        fn = results[0].FirstName;
        ln = results[0].LastName;
        em = results[0].Email;
        }

        var ret = { id:id, firstName:fn, lastName:ln, Email:em, error:''};
        res.status(200).json(ret);
    });

    app.post('/api/updateUser', async(req, res, next) =>
    {
        // incoming login, password firstName, LastName, email
        // outgoing login, password firstName, LastName, email

        const {login, password, FirstName, LastName, Email} = req.body;
        const newUser = {Login:login, Password:password, FirstName:FirstName, LastName:LastName, Email:Email};
        let error = '';
        let fn = '';
        let ln = '';
        let un = '';
        let pw = '';
        let em = '';
        let id = '';
        try
        {
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
            error = e.toString();
        }

        // send return to front end
        let ret = {ID:id, Login:un, Password:pw, FirstName:fn,
            LastName:ln, Email:em, error: error};
        res.status(200).json(ret);
    });

    app.post('/api/deleteUser', async(req, res, next) =>
    {
        // incoming login, password
        // outgoing error code
        let error = '';
        const { login, password } = req.body;

        try
        {
            const db = client.db("LargeProject");
            const result = await db.collection('Users').deleteOne({Login:login});
        }
        catch(e)
        {
            error = e.toString();
        }

        let ret = {error: error};
        res.status(200).json(ret);
    });
}
