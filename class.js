const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Instructor = require('./instructor.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const url = 'mongodb+srv://jbenitezconde:WeLoveCOP4331@cluster0.okas9ix.mongodb.net/?retryWrites=true&w=majority';
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(url);
client.connect(console.log("Class.js:\t\tmongodb connected"));

exports.findClass = async function (code, type, title, section, number, modality, credits, professorFName, professorLName, times, room) {
    const searchData = {
      Code: code,
      Type: type,
      Title: title,
      Section: section,
      Number: number,
      Modality: modality,
      Credits: credits,
      'Professor.FirstName': professorFName,
      'Professor.LastName': professorLName,
      Times: times,
      Room: room
    };
  
    // Build the query object
    const query = {};
    for (const key in searchData) {
        if (searchData[key] !== undefined && searchData[key] !== null && searchData[key] !== '') {
            if (key === 'Number' || key === 'Credits') {
                query[key] = parseInt(searchData[key]);
            } else {
                query[key] = { $regex: new RegExp(searchData[key], 'i') };
            }
        }
    }
  
    // Find the document(s) that match the query
    const db = client.db('LargeProject');
    const results = await db.collection('Classes').find(query).toArray();
    return (results.length > 0) ? results : null;
}

exports.setApp = function ( app, client ) {
    app.post('/class/search', async (req, res, next) => {
        // incoming: Code, Type, Title, Section, Number, Modality, Credits, ProfessorFName, ProfessorLName, Times, Room
        // outgoing: error, results

        const { Code, Type, Title, Section, Number, Modality, Credits, ProfessorFName, ProfessorLName, Times, Room } = req.body;
        
        var error = '';
        var success = true;
        
        try {
            let code = Code.trim();
            let type = Type.trim();
            let title = Title.trim();
            let section = Section.trim();
            let modality = Modality.trim();
            let professorFName = ProfessorFName.trim();
            let professorLName = ProfessorLName.trim();
            let times = Times.trim();
            let room = Room.trim();

            var results = await this.findClass(code, type, title, section, Number, modality, Credits, professorFName, professorLName, times, room);
            if (results == null) {
                throw "No results found";
            }

        } catch (e) {
            success = false;
            error = e.toString();
        }

        var ret = {Success: success, error: error, results: results };
        res.status(200).json(ret);
    });

    app.post('/class/add', async (req, res, next) => {
        // incoming: Code, Name, Professor, Semester, Year, Rating, Reviews
        // outgoing: error

        const { Code, Type, Title, Section, Number, Modality, Credits, ProfessorFName, ProfessorLName, Times, Room} = req.body;
        
        let professorFName = ProfessorFName.trim();
        let professorLName = ProfessorLName.trim();


        try {
            var error = '';
            var success = true;

            if (findClass(Code, Type, Title, Section, Number, Modality, Credits, professorFName, professorLName, Times, Room) != null) {
                throw "Class already exists";
            }

            let professor = await Instructor.findInstructor(professorFName, professorLName, null);
            if (professor == null || professor.length != 1) {
                throw "Professor not found, or multiple professors found";
            }

            professor = professor[0];
                        
            const newClass = {
                Code : Code,
                Type : Type,
                Title : Title,
                Section : Section,
                Number : Number,
                Modality : Modality,
                Credits : Credits,
                Professor : professor,
                Times : Times,
                Room : Room
            };

            const db = client.db("LargeProject");
            const result = db.collection('Classes').insertOne(newClass);
        } catch(e) {
            success = false;
            error = e.toString();
        }

        var ret = {Success: success, error: error };
        res.status(200).json(ret);
    });
}