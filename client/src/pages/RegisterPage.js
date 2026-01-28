import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { REGISTER_MUTATION } from '../graphql/user/userMutation';
import { useMutation } from "@apollo/client";
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [ registerMutation ] = useMutation(REGISTER_MUTATION);

  const handleRegister = async (userData) => {
    try {
      const { data } = await registerMutation({
        variables: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
        },
      });
      console.log(data);
      if (data.createUser.errors) {
        throw new Error(data.createUser.errors.message || 'Error al registrar usuario');
      }

      const user = data.createUser.user;
      const token = data.createUser.token;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      console.log("Usuario registrado y token almacenado:", token);
      navigate('/dashboard');

    } catch (error) {
      throw new Error(error.message || 'Error al registrar usuario');
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