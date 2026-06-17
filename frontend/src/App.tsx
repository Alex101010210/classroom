import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from './pages/teacher/Dashboard';
import Clases from './pages/teacher/Clases';
function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/clases" element={<Clases />} />
      </Routes>
    </Router>
  )
}

export default App

// Made with Bob
