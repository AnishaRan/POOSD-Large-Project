import React, { useState } from 'react';
import { Form, Button} from 'react-bootstrap';
import './Courses.css';


function Courses() {

  const [searchCriteria, setSearchCriteria] = useState({});
  const [searchResults, setSearchResults] = useState([]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const data = await searchCourses(searchCriteria);
    setSearchResults(data);
  }

  const searchCourses = async event => {
    // call function to query database or API with searchCriteria

    var obj = {
      Code: searchCriteria.title,
      Type: "",
      Title: "",
      Section: "",
      Number: null,
      Modality: "",
      Credits: null,
      ProfessorFName: "",
      ProfessorLName: "",
      Times: "",
      Room: ""
    };

    try {
      const response = await fetch('http://cop4331-ucaf1.herokuapp.com/class/search', { 
        method:'POST',  
        headers:{ 
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(obj),
      });

      var res = await response.json();
      return res.results;
    }
    catch(error)
    {
      alert(error.toString());
      return;
    }  
  };

  console.log(searchResults);
  return (
    <div>
      <div>
        <Form className="d-flex justify-content-center" onSubmit={handleFormSubmit}>
          <Form.Group controlId="formCourseTitle" className="col-3">
            <Form.Control 
              type="text" 
              placeholder="Enter course title" 
              onChange={(event) => setSearchCriteria({ ...searchCriteria, title: event.target.value })}
            />
          </Form.Group>

          <Button onClick={searchCourses} variant="primary" type="submit"> Search </Button>
        </Form>
      </div>
      <table className="table table-striped table-hover text-nowrap">
        <thead className="thead-dark">
          <tr>
            <th className="col-1">Code</th>
            <th className="col-1">Section</th>
            <th className="col-2">Title</th>
            <th className="col-1">Type</th>
            <th className="col-1">Professor</th>
            <th className="col-1">Times</th>
            <th className="col-1"></th>
            <th className="col-1"></th>
          </tr>
        </thead>
        <tbody>
          {searchResults && searchResults.map(row => {
            return (
              <tr>
                <td>{row.Code}</td>
                <td>{row.Section}</td>
                <td>{row.Title}</td>
                <td>{row.Type}</td>
                <td>{row.Professor.FirstName} {row.Professor.LastName}</td>
                <td>{row.Times}</td>
                <td >
                  <Button variant="success" onClick="">Add Class</Button>
                </td>
                <td>
                  <Button variant="danger" onClick="">Remove Class</Button>
                </td>
              </tr>
            );
          })}    
        </tbody>
      </table>
    </div>
  );
}

export default Courses;



