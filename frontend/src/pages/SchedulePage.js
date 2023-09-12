// React Libraries
import React from 'react';
import Schedule from '../components/Schedule';
import NavBar from '../components/NavBar';

// Bootstrap
import Row from 'react-bootstrap/Row';


const styles = {
	container: {
	  display: 'flex',
	  flexDirection: 'row',
	  height: '100vh'
	},
	sidebar: {
	  width: '250px'
	},
	webpage: {
	  flexGrow: 1,
	  overflowY: 'scroll'
	}
  };


function SchedulePage() {


	return(
		<div>
			<NavBar />
			<div className="container">
			
				<Row classname = "d-flex align-items-center">
				<h1>Schedule</h1>
			</Row>      
			<hr/>
			<Row className="d-flex justify-content-center">
			<Schedule className= "d-flex col"/>
			</Row>
			
			</div>
	
		</div>
	);
};
export default SchedulePage;