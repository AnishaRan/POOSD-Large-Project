// React Libraries
import React, { useState } from 'react';

// Bootstrap
import Container from 'react-bootstrap/Container';
import Courses from '../components/Courses';
import NavBar from '../components/NavBar';
import Row from 'react-bootstrap/Row';


function CoursesPage() {


	return(
		<div>
			<NavBar />
			<div className="container">
			
				<Row classname = "d-flex align-items-center">
				<h1>Courses</h1>
			</Row>      
			<hr/>
			<Row className="d-flex justify-content-center">
			<Courses className= "d-flex col"/>
			</Row>
			
			</div>
	
		</div>
	);
};
export default CoursesPage;