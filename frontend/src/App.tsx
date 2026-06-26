import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from './pages/teacher/Dashboard';
import Clases from './pages/teacher/Clases';
import ClassDetail from './pages/teacher/ClassDetail';
import Foro from './pages/teacher/Foro';
import ForoDetail from './pages/teacher/ForoDetail';
import Discusiones from './pages/teacher/Discusiones';
import Avisos from './pages/teacher/Avisos';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/teacher/dashboard" replace />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/clases" element={<Clases />} />
        <Route path="/teacher/class/:classId" element={<ClassDetail />} />
        <Route path="/teacher/foro" element={<Foro />} />
        <Route path="/teacher/foros-list" element={<ForoDetail />} />
        <Route path="/teacher/discusiones/:foroId" element={<Discusiones />} />
        <Route path="/teacher/avisos" element={<Avisos />} />
      </Routes>
    </Router>
  )
}

export default App

// Made with Bob
