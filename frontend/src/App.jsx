import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import SignupPage from './components/Signup';
import LoginPage from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import SupervisorDashboard from './components/SupervisorDashboard';
import AdminDashboard from './components/AdminDashboard';
import { isLoggedIn } from './auth/script';

function App() {
    // Initialize token state from localStorage
    

    return (
        <Router>
            <Routes>

                
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signin" element={<SignupPage />} />
                <Route path="/admindashboard" element={<AdminDashboard />} />
                <Route path="/supervisordashboard" element={<SupervisorDashboard />} />
                <Route path="/studentdashboard" element={<StudentDashboard />} />
                
                {/* <Route 
                    path="/admindashboard" 
                    element={isLoggedIn() ? <AdminDashboard /> : <Navigate to="/login" />}                
                />
                <Route 
                    path="/supervisordashboard" 
                    element={isLoggedIn() ? <SupervisorDashboard /> : <Navigate to="/login" />}                
                />
                <Route 
                    path="/studentdashboard"
                    element={isLoggedIn() ? <StudentDashboard /> : <Navigate to="/login" />}                
                /> */}
                
                




            </Routes>
        </Router>
    );
}

export default App;