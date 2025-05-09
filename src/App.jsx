import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import CalendarPage from './pages/CalendarPage';
import ExpensesPage from './pages/ExpensesPage';

const isLoggedIn = () => !!localStorage.getItem('token');

function App() {
  return (
    <Routes>
      <Route path="https://chi-tieu-web-client.vercel.app/login" element={<Login />} />
      <Route path="https://chi-tieu-web-client.vercel.app/register" element={<Register />} />
      <Route
        path="https://chi-tieu-web-client.vercel.app/calendar"
        element={isLoggedIn() ? <CalendarPage /> : <Navigate to="https://chi-tieu-web-client.vercel.app/login" />}
      />
      <Route
        path="https://chi-tieu-web-client.vercel.app/expenses/:date"
        element={isLoggedIn() ? <ExpensesPage /> : <Navigate to="https://chi-tieu-web-client.vercel.app/login" />}
      />
      <Route path="*" element={<Navigate to="https://chi-tieu-web-client.vercel.app/calendar" />} />
    </Routes>
  );
}

export default App;
