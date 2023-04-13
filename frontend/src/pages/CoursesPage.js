// React Libraries
import React, { useState } from 'react';

// Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

function CoursesPage() {


	return(
    <div className="course-container">
      <h1>Your Courses</h1>
      <Row>

      </Row>      
      
      <Row className="d-flex justify-content-center">
        <hr/>
        <div className="form-group mx-sm-5 mb-1">
          <input className="form-control" type="text" id="loginName" placeholder="Username" /><br/>
        </div>
      </Row>
      <Row>

      </Row>
    </div>
	);
};
export default CoursesPage;
