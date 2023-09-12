import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PageTitle from '../components/PageTitle';
import Col from 'react-bootstrap/Col';
import Logo from '../images/logo.png';
import {Link} from "react-router-dom";


function VerifyEmail()
{
    function verifyUser (userId, token) {
        return fetch(`https://cop4331-ucaf1.herokuapp.com/email/verify/${userId}/${token}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        }).then(response => response.json()).then(data => {
          return data; // Return the parsed JSON data
        });
      }
      
      verifyUser('6435bb9470963e821238fc72', 'Hello').then(data => {
        console.log(data.err);
      });

      
  

    return(
    <Container class="d-flex align-items-center">

	</Container>
    );
};

export default VerifyEmail;
