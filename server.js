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


app.post('/api/register', async(req, res, next) =>
{
  // incoming login, password firstName, LastName, email
  // outgoing error

  const {login, password, FirstName, LastName, Email} = req.body;
  const newUser = {login:login, password:password, FirstName:FirstName, LastName:LastName, Email:Email};
  let error = '';

  try
  {
    const db = client.db("LargeProject");
    const result = db.client('Users').insertOne(newUser);
  }
  catch(e)
  {
    Error = e.toString();
  }

  // send return to front end
  let ret = { error: error};
  res.status(200).json(ret);
});

app.post('/api/login', async (req, res, next) => 
{
 // incoming: login, password
 // outgoing: id, firstName, lastName, error
	
 var error = '';

 const { login, password } = req.body;

 const db = client.db("LargeProject");
 const results = await db.collection('Users').find({Login:login,Password:password}).toArray();

 var id = -1;
 var fn = '';
 var ln = '';

 if( results.length > 0 )
 {
  id = results[0].UserID;
  fn = results[0].FirstName;
  ln = results[0].LastName;
 }

 var ret = { id:id, firstName:fn, lastName:ln, error:''};
 res.status(200).json(ret);
});

app.post('/api/updateUser', async(req, res, next) =>
{
  // incoming login, password firstName, LastName, email
  // outgoing error

  const {login, password, FirstName, LastName, Email} = req.body;
  const newUser = {login:login, password:password, FirstName:FirstName, LastName:LastName, Email:Email};
  let error = '';

  try
  {
    // find the user's ID
    // update the information in the row of that userID
    const db = client.db("LargeProject");
    //const result = db.client('Users').insertOne(newUser);
  }
  catch(e)
  {
    Error = e.toString();
  }

  // send return to front end
  let ret = { error: error};
  res.status(200).json(ret);
});

app.listen(5000); // start Node + Express server on port 5000
