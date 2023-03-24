import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PageTitle from '../components/PageTitle';
import Col from 'react-bootstrap/Col';


function Login()
{

    var loginName;
    var loginPassword;

    const [message, setMessage] = useState('');

    const doLogin = async event => 
  {
    event.preventDefault();

        var obj = {login:loginName.value,password:loginPassword.value};
        var js = JSON.stringify(obj);

    try
    {  
      const response = await fetch('http://localhost:5000/api/login',
        {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

      var res = JSON.parse(await response.text());

      if( res.id <= 0 )
      {
        setMessage('User/Password combination incorrect');
      }
      else
      {
        var user = {firstName:res.firstName,lastName:res.lastName,id:res.id}
        localStorage.setItem('user_data', JSON.stringify(user));

        setMessage('');
        window.location.href = '/cards';
      }
    }
    catch(e)
    {
      alert(e.toString());
      return;
    }  
  };

    return(
    <Container class="d-flex align-items-center">
		<Row>
			<Col>
				<div id="loginDiv" class="loginDiv">
					<PageTitle/>
					<form class="form-inline" onSubmit={doLogin}>
						<span class="d-flex justify-content-center pt-4" id="inner-title"></span><br/>
						<div class="form-group mx-sm-5 mb-1">
							<input class="form-control" type="text" id="loginName" placeholder="Username" ref={(c) => loginName = c}/><br/>
						</div>
						<div class="form-group mx-sm-5 mb-2">
							<input class="form-control" type="password" id="loginPassword" placeholder="Password" ref={(c) => loginPassword = c}/><br/>
						</div>
						<div class="d-flex justify-content-center pt-2 pb-4">
						<input class="btn btn-warning" type="submit" id="loginButton" value = "Log In" onClick={doLogin}/>
						</div>
						
					</form>
					<span class="d-flex justify-content-center" id="loginResult">{message}</span>
					<div class="row pt-3 pb-4 d-flex justify-content-center">
						<div class="col-md-auto">Don't have an account?</div>
						<div class="col-md-auto"><a href=''> Register here.</a></div>
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
