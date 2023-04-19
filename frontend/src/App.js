// React Libraries
import React from 'react';
import './App.css';
import 'devextreme/dist/css/dx.light.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Routes
import LoginPage from './pages/LoginPage';
import VerifyEmail from './pages/EmailVerificationPage';

import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import SchedulePage from './pages/SchedulePage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" index element={<LoginPage />} />
        <Route path="/register" index element={<RegisterPage />} />
        <Route path="/email-verification" index element={<VerifyEmail/>} /> 
        <Route path="/resetpassword" index element={<ResetPasswordPage />} />
        <Route path="/courses" index element={<CoursesPage />} />
        <Route path="/schedule" index element={<SchedulePage/>} />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App;
