import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from './pages/teacher/Dashboard';
import StudentDashboard from './pages/student/Dashboard';
import Clases from './pages/teacher/Clases';
import Login from './pages/Login';
import Register from './pages/Register';
import PollsList from './pages/student/PollsList';  
import TakePoll from './pages/student/TakePoll';    

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/clases" element={<Clases />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/class/:classId/polls" element={<PollsList />} />
        <Route path="/student/poll/:pollId" element={<TakePoll />} />  
      </Routes>
    </Router>
  )
}

export default App
