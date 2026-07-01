import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import Clases from './pages/teacher/Clases';
import ClassDetail from './pages/teacher/ClassDetail';
import Foro from './pages/teacher/Foro';
import ForoDetail from './pages/teacher/ForoDetail';
import StudentForo from './pages/student/Foro';
import StudentForoDetail from './pages/student/ForoDetail';
import Discusiones from './pages/teacher/Discusiones';
import Avisos from './pages/teacher/Avisos';
import Login from './pages/Login';
import Register from './pages/Register';
import PollsList from './pages/student/PollsList';
import TakePoll from './pages/student/TakePoll';
import PollResults from './pages/student/PollResults';
import StudentProfile from './pages/student/StudentProfile';
import TeacherProfile from './pages/teacher/Profile';
import Examen from './pages/teacher/Examen';
import Encuestas from './pages/teacher/Encuestas';
import TareaDetail from './pages/teacher/TareaDetail';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rutas protegidas de Profesor */}
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute><TeacherDashboard /></ProtectedRoute>
        } />
        <Route path="/teacher/clases" element={
          <ProtectedRoute><Clases /></ProtectedRoute>
        } />
        <Route path="/teacher/class/:classId" element={
          <ProtectedRoute><ClassDetail /></ProtectedRoute>
        } />
        <Route path="/teacher/class/:classId/task/:taskId" element={
          <ProtectedRoute><TareaDetail /></ProtectedRoute>
        } />
        <Route path="/teacher/profile" element={
          <ProtectedRoute><TeacherProfile /></ProtectedRoute>
        } />
        <Route path="/teacher/foro" element={
          <ProtectedRoute><Foro /></ProtectedRoute>
        } />
        <Route path="/teacher/foros-list" element={
          <ProtectedRoute><ForoDetail /></ProtectedRoute>
        } />
        <Route path="/teacher/discusiones/:foroId" element={<Discusiones />} />
        <Route path="/teacher/avisos" element={<Avisos />} />
        <Route path="/teacher/examen" element={<Examen />} />
        <Route path="/teacher/encuestas" element={<Encuestas />} />

        {/* Rutas protegidas de Estudiante */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute><StudentDashboard /></ProtectedRoute>
        } />
        <Route path="/student/class/:classId/polls" element={
          <ProtectedRoute><PollsList /></ProtectedRoute>
        } />
        <Route path="/student/poll/:pollId" element={
          <ProtectedRoute><TakePoll /></ProtectedRoute>
        } />
        <Route path="/student/poll/:pollId/results" element={
          <ProtectedRoute><PollResults /></ProtectedRoute>
        } />
        <Route path="/student/profile" element={
          <ProtectedRoute><StudentProfile /></ProtectedRoute>
        } />
        <Route path="/student/foro" element={
          <ProtectedRoute><StudentForo /></ProtectedRoute>
        } />
        <Route path="/student/foros-list" element={
          <ProtectedRoute><StudentForoDetail /></ProtectedRoute>
        } />
        
      </Routes>
    </Router>
  )
}

export default App
