import React, { useState } from 'react';
import { useJwt } from "react-jwt";
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PageTitle from '../components/PageTitle';
import Col from 'react-bootstrap/Col';


function Login() {

	var bp = require('./Path.js');
	var storage = require('../tokenStorage.js');
	var loginName;
	var loginPassword;
	const [message,setMessage] = useState('');

	const doLogin = async event => {
		event.preventDefault();
		var obj = {login:loginName.value,password:loginPassword.value};
		var js = JSON.stringify(obj);
		var config = {
			method: 'post',
			url: bp.buildPath('api/login'),
			headers: {
				'Content-Type': 'application/json'
			},
			data: js
		};
		axios(config)
		.then(function (response) {
			var res = response.data;
			if (res.error) 		{
				setMessage('User/Password combination incorrect');
			}
			else 		{
				storage.storeToken(res);
				var jwt = require('jsonwebtoken');
				var ud = jwt.decode(storage.retrieveToken(),{complete:true});
				var userId = ud.payload.userId;
				var firstName = ud.payload.firstName;
				var lastName = ud.payload.lastName;
				var user = {firstName:firstName,lastName:lastName,id:userId}
				localStorage.setItem('user_data', JSON.stringify(user));
				window.location.href = '/cards';
			}
		})
		.catch(function (error) {
			console.log(error);
		});
	}

	return(
	<Container className="d-flex align-items-center">
		<Row>
			<Col>
				<div id="loginDiv" className="loginDiv">
					<PageTitle/>
					<div className="d-flex justify-content-center">
						<img src={Logo} alt="React" className="logo-login"/> 
					</div>
					<form className="form-inline" onSubmit={doLogin}>
						<span className="d-flex justify-content-center pt-4" id="inner-title"></span><br/>
						<div className="form-group mx-sm-5 mb-1">
							<input className="form-control" type="text" id="loginName" placeholder="Username" ref={(c) => loginName = c}/><br/>
						</div>
						<div classNamw="form-group mx-sm-5 mb-2">
							<input className="form-control" type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c}/><br/>
						</div>
						<div className="d-flex justify-content-center pt-2 pb-4">
						<input className="btn btn-warning" type="submit" id="loginButton" value = "Log In" onClick={doLogin}/>
						</div>
						
					</form>
					<span className="d-flex justify-content-center" id="loginResult">{message}</span>
					<div className="row pt-3 pb-4 d-flex justify-content-center">
						<div className="col-md-auto">Don't have an account?</div>
						<div className="col-md-auto"><a href=''> Register here.</a></div>
					</div>
				</div>
			</Col>
			<Col></Col>
			<Col></Col>
		</Row>
	</Container>
	);
};
export default Login;