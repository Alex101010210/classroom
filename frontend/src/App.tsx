import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherDashboard from './pages/teacher/Dashboard';
import Clases from './pages/teacher/Clases';
import ClassDetail from './pages/teacher/ClassDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherProfile from './pages/teacher/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />
        
        {/* Rutas protegidas */}
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute><TeacherDashboard /></ProtectedRoute>
        } />
        <Route path="/teacher/clases" element={
          <ProtectedRoute><Clases /></ProtectedRoute>
        } />
        <Route path="/teacher/class/:classId" element={
          <ProtectedRoute><ClassDetail /></ProtectedRoute>
        } />
        <Route path="/teacher/profile" element={
          <ProtectedRoute><TeacherProfile /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App