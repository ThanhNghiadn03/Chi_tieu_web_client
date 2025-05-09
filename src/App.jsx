import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CalendarPage from './pages/CalendarPage';
import ExpensesPage from './pages/ExpensesPage';

const isLoggedIn = () => !!localStorage.getItem('token');

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/calendar"
        element={isLoggedIn() ? <CalendarPage /> : <Navigate to="/login" />}
      />
      <Route
        path="/expenses/:date"
        element={isLoggedIn() ? <ExpensesPage /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/calendar" />} />
    </Routes>
  );
}

export default App;
