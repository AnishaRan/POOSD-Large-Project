// React Libraries
import React, { useState } from 'react';

// Bootstrap
import Schedule from '../components/Schedule';
import Row from 'react-bootstrap/Row';


function SchedulePage() {


	return(
	    <div className="d-flex container">
	      <Row className = "row">
		<h1 className="col">Schedule</h1>
		<hr/>
		<Schedule className="col col-lg-2"/>
	      </Row>
	    </div>
	);
};
export default SchedulePage;
