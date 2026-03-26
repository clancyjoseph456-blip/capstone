import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectsGallery from './pages/ProjectsGallery';
import ProjectDetail from './pages/ProjectDetail';
import SubmitProject from './pages/SubmitProject';
import MyProjects from './pages/MyProjects';
import ReviewProjects from './pages/ReviewProjects';
import Dashboard from './pages/Dashboard';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/projects" element={<ProjectsGallery />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />

          {/* Student only */}
          <Route path="/submit" element={
            <ProtectedRoute roles={['student']}>
              <SubmitProject />
            </ProtectedRoute>
          } />
          <Route path="/my-projects" element={
            <ProtectedRoute roles={['student']}>
              <MyProjects />
            </ProtectedRoute>
          } />

          {/* Supervisor + Admin */}
          <Route path="/review" element={
            <ProtectedRoute roles={['supervisor', 'admin']}>
              <ReviewProjects />
            </ProtectedRoute>
          } />

          {/* Admin only */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div className="page-container text-center" style={{ paddingTop: '6rem' }}>
              <div style={{ fontSize: '5rem' }}>404</div>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)' }}>Page Not Found</h2>
              <a href="/" className="btn btn-primary mt-2">Go Home</a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
