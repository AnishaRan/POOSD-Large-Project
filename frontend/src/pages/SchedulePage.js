// React Libraries
import React, { useState } from 'react';
import Schedule from '../components/Schedule';

// Bootstrap
import Container from 'react-bootstrap/Container';


function SchedulePage() {


	return(
        <div className="container">
      		<Row classname = "d-flex align-items-center">
      		<h1>Schedule</h1>
	      </Row>      
	      <hr/>
	      <Row className="d-flex justify-content-center">
		<Schedule className= "d-flex col"/>
	      </Row>
	</div>
	);
};
export default SchedulePage;
