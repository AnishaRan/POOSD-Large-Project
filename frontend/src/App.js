import 'devextreme/dist/css/dx.light.css';
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import SchedulePage from './pages/SchedulePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import VerifyEmail from './pages/EmailVerificationPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" index element={<LoginPage />} />
      {/* <Route path="/cards" index element={<CardPage />} /> */}
      <Route path="/register" index element={<RegisterPage />} />
      <Route path="/email-verification/:param1/:param2" index element={EmailVerificationPage} /> 
      <Route path="/resetpassword" index element={<ResetPasswordPage />} />
      <Route path="/courses" index element={<CoursesPage />} />
      <Route path="/schedule" index element={<SchedulePage />} />
    </Routes>
  </BrowserRouter>
);
}

export default App;
