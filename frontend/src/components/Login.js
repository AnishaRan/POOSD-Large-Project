// React Libraries
import React, { useState } from 'react';
import {Link } from "react-router-dom";

// Links
import Logo from '../images/logo.png';

// Bootstrap
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Components
import PageTitle from '../components/PageTitle';




function Login () {

	var loginName;
	var loginPassword;
	

	const [message, setMessage] = useState('');

	function buildPath(route) {
		if (process.env.NODE_ENV === 'production') {
			return 'https://cop4331-ucaf1.herokuapp.com/' + route;
		}
		else {        
			return 'http://localhost:5000/' + route;
		}
	}

	const doLogin = async event => {
    event.preventDefault();

		var obj = {
			Login: loginName.value,
			Password: loginPassword.value
		};

    try {  

      const response = await fetch(buildPath('user/login'), {
				method:'POST',
				headers:{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(obj)
			});

      var res = JSON.parse(await response.text());
      console.log(res);
      
      if( res.succcess !== true) {
        setMessage('User/Password combination incorrect');
      } else if(res.Verified !== true) {
		setMessage('Please verify email first');
	  }
      else {
        var user = {
					firstName: res.firstName,
					lastName: res.lastName,
					id: res.id,
					token: res.CookieToken
			  }

				localStorage.clear();
        localStorage.setItem('user_data', JSON.stringify(user));
				localStorage.setItem('a', res.id);
				localStorage.setItem('b', 'hello');
				//console.log(res);
        setMessage('');
        window.location.href = '/schedule';
			
      }
    }
    catch(e) {
      alert(e.toString());
      return;
    }    
  };

	

	return(
		<Container className="d-flex align-items-center">
			<Row>
				<Col>
					<div id="loginDiv" className="loginDiv">
						<PageTitle className="d-flex align-items-center justify-content-center"/>
						<form className="form-inline" onSubmit={doLogin}>
							<span className="d-flex justify-content-center pt-4" id="inner-title"><img src={Logo} alt="React" className="logo-login"/> </span><br/>
							<div className="form-group mx-sm-5 mb-1 formSpacer">
								<input className="form-control" type="text" id="loginName" placeholder="Username" ref={(c) => loginName = c}/><br/>
							</div>
							<div className="form-group mx-sm-5 mb-2 formSpacer">
								<input className="form-control" type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c} /><br/>
							</div>
							<div className="d-flex justify-content-center pt-2 pb-4">
							<input className="btn btn-warning" type="submit" id="loginButton" value = "Log In" onClick={doLogin} />
							</div>
							
						</form>
						<span className="d-flex justify-content-center" id="loginResult">{message}</span>
						<div className="row justify-content-center pt-3 pb-4">
							<div className="row justify-content-center">Don't have an account? <Link className="row justify-content-center" to='/Register'>Register Here.</Link></div>
							<div className="row justify-content-center">Forgot your password? <Link className="row justify-content-center" to='/resetpassword'>Reset Here.</Link></div>
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