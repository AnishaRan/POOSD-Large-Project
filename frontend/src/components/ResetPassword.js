import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PageTitle from '../components/PageTitle';
import Col from 'react-bootstrap/Col';
import {Link} from "react-router-dom";
import Logo from '../images/logo.png';

let regVerKey;
let regEmail;
let regId;
let regLogin;
let regFirstName;
let regLastName;
let regEmailSentOut;
let regCookieToken;
//const regVerKey;
let confCode;
let regConfCode;
let regNewPass;
let regConfPass;

function ResetPassword() {




    //let resetPassword;


    const [message, setMessage] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);


    //const app_name = 'cop4331-ucaf1'
    /*function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production') 
        {
            return 'https://' + app_name +  '.herokuapp.com/' + route;
        }
        else
        {        
            return 'http://localhost:5000/' + route;
        }
    }*/

    function buildPath(route) {
        return 'https://cop4331-ucaf1.herokuapp.com/' + route;
      }



    const doReset = async (event) => {


        

        //var regEmail = '';
        

        event.preventDefault();

        let temp = {
            Email: regEmail.value
          }

          console.log(temp.Email);
      
          if(temp.Email === "") {
            setMessage("Please fill in empty field");
            return;
          }

          //res.status(200).json({Success: success, user:user, err : error,  token: verificationString});
      
          //let js = JSON.stringify(temp);


          try {

            /*const response = await fetch(buildPath('user/login'), {
				method:'POST',
				headers:{
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(obj)
			});*/

      //var res = JSON.parse(await response.text());
      //console.log(res);

            var obj = { Email: temp.Email };
            var js = JSON.stringify(obj);

            const response = await fetch('https://cop4331-ucaf1.herokuapp.com/email/passwordreset',
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
      
            var res = JSON.parse(await response.text());
            console.log(res);

            if(res.Success === true) {

                setMessage("Email sent, please check your email");

                /*let regEmail;
                let regId;
                let regLogin;
                let regFirstName;
                let regLastName;
                let regEmailSentOut;
                let regCookieToken;*/

                regId = res.user._id;
                regLogin = res.user.Login;
                console.log(regLogin);
                regFirstName = res.user.FirstName;
                regLastName = res.user.LastName;
                regEmailSentOut = res.user.Email;
                regCookieToken = res.user.CookieToken;
                regVerKey = res.token;

                /*localStorage.setItem('user_data', JSON.stringify(user));
				localStorage.setItem('a', res.user._id);
				localStorage.setItem('b', 'hello');*/

                console.log("ver key = "+res.token);

                setFormSubmitted(true);  






            } else {
                setMessage("Please enter a valid email");
            }
            

          } catch(e) {
            alert(e.toString());
            return;
          }



               

    }


    const changePasswordCall = async (event) =>  {

        /*let temp = {
            Email: regConfCode.value
          }

      
          if(temp.Email === "") {
            setMessage("Please fill in empty field");
            return;
          }*/

          let confirmationCode = regConfCode.value;
          let newPass = regNewPass.value;
          let confPass = regConfPass.value

        console.log(confirmationCode);
        console.log(newPass);
        console.log(confPass);

        try{

            if(newPass !== confPass) {
                throw "Password does not match"
            }

            console.log(regVerKey);
             console.log(regFirstName);
    
            if(regVerKey !== confirmationCode) {
                throw "Enter correct verification key"
            }
            console.log(regVerKey);
            console.log(confirmationCode);
            console.log("EMAIL");
            console.log(regEmailSentOut);

           


            var obj = {
                userId: regId,
                login: regLogin,
                password: newPass,
                FirstName: regFirstName,
                LastName: regLastName,
                Email: regEmailSentOut,
                CookieToken: regCookieToken

            };


      
            //var res = JSON.parse(await response.text());
            //console.log(res);

            var js = JSON.stringify(obj);

            const response = await fetch('https://cop4331-ucaf1.herokuapp.com/user/update',
              {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
      
            var res = JSON.parse(await response.text());
            console.log(res);

            //window.location.href = '/';
            setMessage("Password change successful. Go to login page");
            window.location.href = '/';


        }catch(e) {
            console.log(e);
            setMessage(e);
        }


    };



        return(

            <Container class="d-flex align-items-center">
                <Row>
                    <Col>
                        <div id="loginDiv" class="loginDiv">
                            <PageTitle/>
                            <form class="form-inline" onSubmit={doReset}>
                                <span class="d-flex justify-content-center pt-0" id="inner-title"><img src={Logo} alt="React" className="logo-login"/></span><br/>
                                {!formSubmitted && (
                                <div class="form-group mx-sm-5 mb-1">
                                    <input class="form-control" type="text" id="email" placeholder="Email" ref={(c) => regEmail = c}/><br/>
                                </div>
                                )}
                                {/* <div class="form-group mx-sm-5 mb-1">
                                    <input class="form-control" type="text" id="resetPassword" placeholder="New Password" ref={(c) => resetPassword = c}/><br/>
                                </div> */}
                                {!formSubmitted && (
                                <div class="d-flex justify-content-center pt-0 pb-2">
                                <input class="btn btn-warning" type="submit" id="resetButton" value = "Reset" onClick={doReset}/>
                                </div>
                                )}
                                
                            </form>

                            <span class="d-flex justify-content-center" id="emailResult">{message}</span>

                            {formSubmitted && (
                                <div class="form-group mx-sm-5 mb-1">
                                    <input class="form-control" type="text" id="email" placeholder="Verification Code" ref={(c) => regConfCode = c}/><br/>
                                </div>
                                )}
                                {formSubmitted && (
                                <div class="form-group mx-sm-5 mb-1">
                                <input class="form-control" type="text" id="email" placeholder="New Password" ref={(c) => regNewPass = c}/><br/>
                                 </div>
                                 )}
                                 {formSubmitted && (
                                <div class="form-group mx-sm-5 mb-1">
                                <input class="form-control" type="text" id="email" placeholder="Confirm Password" ref={(c) => regConfPass = c}/><br/>
                                </div>
                                )}
                            
                                {/* <div class="form-group mx-sm-5 mb-1">
                                    <input class="form-control" type="text" id="resetPassword" placeholder="New Password" ref={(c) => resetPassword = c}/><br/>
                                </div> */}
                                {formSubmitted && (
                                <div class="d-flex justify-content-center pt-0 pb-2">
                                <input class="btn btn-warning" type="submit" id="resetButton" value = "Submit" onClick={changePasswordCall}/>
                                </div>
                                )}

                            <div class="row pt-2 pb-3 d-flex justify-content-center">
                                <div class="col-md-auto">Already have an account?</div>
                                <div class="col-md-auto"><Link to='/'>Login Here.</Link></div>
                            </div>
                        </div>
                    </Col>
                    <Col></Col>
                    <Col></Col>
                </Row>
            </Container>




        );
    //}
        
};

export default ResetPassword;