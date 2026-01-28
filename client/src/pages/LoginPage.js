import React from 'react';
import LoginForm from '../components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION } from '../graphql/user/userMutation';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  const [ loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async (formData) => {
    try {
      const { data } = await loginMutation({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });

      const response = data.login;

      console.log(response)
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        navigate('/dashboard');
      } else if(response.errors){
        alert(`Error: ${response.errors.email || response.errors.password}`)
      } else {
        throw new Error(response.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      alert(error.message);
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
        {loading && <p>Iniciando sesión...</p>}
        {error && <p>Error: {error.message}</p>}
        <div className="register-link">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;