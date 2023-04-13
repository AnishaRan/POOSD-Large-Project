// This is how the navbar works
// I don't know how to place it in the app so for now
// it is in this placeholer file

import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import NavBar from './components/NavBar';

// Links
import Dashboard from './pages/DashboardPage';
import Courses from './pages/CoursesPage';
import Schedule from './pages/SchedulePage';
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';


function App () {
  return (
    <BrowserRouter>
      <NavBar>
        <Routes>
          <Route path="/" index element={<Dashboard />} />
          <Route path="/dashboard" index element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
      </NavBar>
    </BrowserRouter>
  );
}
export default App;