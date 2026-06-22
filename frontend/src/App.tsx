import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from './pages/teacher/Dashboard';
import Clases from './pages/teacher/Clases';
import Login from './pages/Login';
import Register from './pages/Register';
function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/clases" element={<Clases />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App

