import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Register from './pages/auth/Register/Register';
import Login from './pages/auth/Login/Login';
import VerifyEmail from './pages/auth/VerifyEmail/VerifyEmail';
import Dashboard from './pages/Dashboard/Dashboard';
import ForgotPassword from './pages/auth/ForgotPassword/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import CaseDetail from './pages/CaseDetail';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/case/:id" element={<CaseDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
