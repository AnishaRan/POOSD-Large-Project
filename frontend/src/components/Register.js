import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PageTitle from '../components/PageTitle';
import Col from 'react-bootstrap/Col';
import {Link} from "react-router-dom";

let regFirstName;
let regLastName;
let regEmail;
let regUsername;
let regPassword;
let regId;
let user;

function Register() {




    const [message, setMessage] = useState("");
    const [formSubmitted, setFormSubmitted] = useState(false);


    const app_name = 'cop4331-ucaf1'
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production') 
        {
            return 'https://' + app_name +  '.herokuapp.com/' + route;
        }
        else
        {        
            return 'http://localhost:5000/' + route;
        }
    }

    const doRegister = async (event) => {


        

        event.preventDefault();

        let temp = {
            FirstName: regFirstName.value,
            LastName: regLastName.value,
            login: regUsername.value,
            password: regPassword.value,
            Email: regEmail.value
        }

        if(temp.FirstName === "" || temp.LastName === "" || temp.login === "" || temp.password === "" || temp.Email === "") {
            setMessage("Please fill in empty fields");
            return;
        }
        

       
        //console.log(regLastName.value);

        let js = JSON.stringify(temp);
        const headers = {"Content-Type": "application/json"}
        
        try {
                //const response = await fetch(buildPath('user/register'), {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
    
                //var res = JSON.parse(await response.text());
                //regId = res.User.insertedId;
                
                
            //if(res.id <= 0) {
                //setMessage("Registration Error");
            //}
            //else {
                console.log(regFirstName.value);
                
                user = {
                    FirstName: regFirstName.value,
                    LastName: regLastName.value,
                    //id: res.id,
                    login: regUsername.value,
                    password: regPassword.value,
                    Email: regEmail.value

                }

                js = JSON.stringify(user);

                const response = await fetch(buildPath('user/register'), {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

                var res = JSON.parse(await response.text());




                console.log(res.User.insertedId);
                regId = res.User.insertedId;
                console.log(regId);
                
                //console.log(res.id.insertedId);
                localStorage.setItem('user_data', JSON.stringify(user));


                const obj2 = { userId : regId }
                var js2 = JSON.stringify(obj2);
                console.log("HERE");

                /*const response1 = await fetch('https://cop4331-ucaf1.herokuapp.com/email/sendverification',
        {method:'POST',body:js2,headers:{'Content-Type': 'application/json'}}).then(response => {

            var result2 = JSON.parse( response1.text());
            console.log(result2);
          return response.json();
        });*/
        const response2 = await fetch('https://cop4331-ucaf1.herokuapp.com/email/sendverification',
        {method:'POST',body:js2,headers:{'Content-Type': 'application/json'}});
        var res2 = JSON.parse(await response2.text());

                setMessage('');

                console.log(res2);

                if(res2.Success === true) {
                    console.log("email sent");
                } else {
                    console.log("Not sent");
                }
                
            }
        
        
        catch (e) {
            alert(e.toString());
            return;
        }


      /*sendVerificationEmail = async() => {
        console.log(regFirstName);
      }

      handleClick = async() => {
        sendVerificationEmail
      }*/



      setFormSubmitted(true); 

      /*if(formSubmitted === true) {

        console.log("TRUEEE-------------------------");
        


      }*/



      //window.location.href = '/'; 



      





    }
    
    ;


        return(

            <Container class="d-flex align-items-center">
                <Row>
                    <Col>
                        <div id="registerDiv" class="registerDiv">
                            <PageTitle/>
                            <form class="form-inline" onSubmit={doRegister}>
                                
                                <span class="d-flex justify-content-center pt-4" id="inner-title"></span><br/>
                                {!formSubmitted && (
                                <div class="form-group mx-sm-5 mb-1">
                                    <input class="form-control" type="text" id="regFirstName" placeholder="First Name" ref={(c) => regFirstName = c}/><br/>
                                </div>
                                )}
                                {!formSubmitted && (
                                <div class="form-group mx-sm-5 mb-1">
                                    <input class="form-control" type="text" id="regLastName" placeholder="Last Name" ref={(c) => regLastName = c}/><br/>
                                </div>
                                )}
                                {!formSubmitted && (
                                <div class="form-group mx-sm-5 mb-1">
                                    <input class="form-control" type="text" id="regEmail" placeholder="Email" ref={(c) => regEmail = c}/><br/>
                                </div>
                                )}
                                {!formSubmitted && (
                                <div class="form-group mx-sm-5 mb-1">
                                    <input class="form-control" type="text" id="regUsername" placeholder="Username" ref={(c) => regUsername = c}/><br/>
                                </div>
                                )}
                                {!formSubmitted && (
                                <div class="form-group mx-sm-5 mb-1">
                                    <input class="form-control" type="text" id="regPassword" placeholder="Password" ref={(c) => regPassword = c}/><br/>
                                </div>
                                )}
                                {!formSubmitted && (
                                <div class="d-flex justify-content-center pt-2 pb-4">
                                <input class="btn btn-warning" type="submit" id="registerButton" value = "Register" onClick={doRegister}/>
                                </div>
                                )}
                                {formSubmitted && (
                                    <div class="row pt-3 pb-4 d-flex justify-content-center">
                                        <div class="col-md-auto">Email Sent</div>
                                    </div>
                                )}
                                
                            </form>
                            <span class="d-flex justify-content-center" id="registerResult">{message}</span>
                            <div class="row pt-3 pb-4 d-flex justify-content-center">
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
        
};

export default Register;