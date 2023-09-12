const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

const path = require('path');
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.set('path', (process.env.PORT || 5000));

//const url = 'mongodb+srv://jbenitezconde:WeLoveCOP4331@cluster0.okas9ix.mongodb.net/?retryWrites=true&w=majority';
require('dotenv').config();
const url = process.env.MONGODB_URI;

const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("mongodb connected"));

var instructor = require('./instructor.js');
instructor.setApp( app, client );

var user = require('./user.js');
user.setApp( app, client );

var courses = require('./class.js');
courses.setApp( app, client );

var email = require('./email.js');
email.setApp( app, client );

if (process.env.NODE_ENV === 'production')
{
// Set static folder
app.use(express.static('frontend/build'));
app.get('*', (req, res) =>
{
res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});
}


//app.listen(5000); // start Node + Express server on port 5000
app.listen(PORT, () =>
{
console.log('Server listening on port ' + PORT);
});

