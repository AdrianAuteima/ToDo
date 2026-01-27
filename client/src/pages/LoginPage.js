import React from 'react';
import LoginForm from '../components/LoginForm';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const response = await login(formData);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>ToDo App</h1>
          <p>Gestiona tus tareas de forma eficiente</p>
        </div>
        <LoginForm onLogin={handleLogin} />
        <div className="register-link">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;