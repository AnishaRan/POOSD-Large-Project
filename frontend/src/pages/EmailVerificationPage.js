// React Libraries
import React from 'react';
import { useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function VerifyEmail () {
  const { param1, param2 } = useParams();
  return (
    <div className="login-bg">
      <Container className="d-flex justify-content-center align-items-center">
			<Row>
				<Col className="wrapper">
					<div id="registerDiv" className="registerDiv">
            <h1>Email Verification</h1>
            <p>Param 1: {param1}</p>
            <p>Param 2: {param2}</p>
					</div>
				</Col>
				<Col></Col>
				<Col></Col>
			</Row>
		</Container>
    </div>
  );
};
export default VerifyEmail;