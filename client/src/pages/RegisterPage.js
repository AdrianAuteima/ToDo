import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    try {
      const response = await register(userData);
      
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
      } else {
        throw new Error(response.message || 'Error al registrar usuario');
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>ToDo App</h1>
          <p>Crea tu cuenta para empezar</p>
        </div>
        <RegisterForm onRegister={handleRegister} />
        <div className="login-link">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;