import { PayPalButtons } from '@paypal/react-paypal-js';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalComponent from '../Componentes/PaypalComponent';
import axios from 'axios';
import './Estilos/subscripcion.css'

function Subscripcion() {
  const [userId, setUserId] = useState('');
  const [membershipType, setMembershipType] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!token) {
      return console.error('Sin token de verificacion');
    }
    try {
      const response = await axios.get('http://localhost:5000/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setUserId(response.data.id);
      setMembershipType(response.data.subscriptionType);
    } catch (err) {
      console.error('Error al intentar acceder al usuario', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpgrade = async (membership) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/users/upgrade',
        { userId, membership },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data.message);
    } catch (err) {
      console.error('Error al actualizar la suscripción:', err);
    }
  };

  return (
    <div className="subscripcion">
      {/* Encabezado */}
      <div className="jumbotron text-center text-white py-5 bg-gradient" style={{marginTop:'100px'}}>
        <h1 className="display-4" style={{color:'black'}}>Elige el Plan de Suscripción Perfecto para Ti</h1>
        <p className="lead" style={{color:'black'}}>Descubre todas las ventajas que ofrecemos con nuestros planes.</p>
      </div>

      {/* Opciones de Planes */}
      <div className="container my-5">
        <div className="row text-center">
          {/* Plan Gratuito */}
          <div className="col-lg-4 col-md-6 col-12 mb-4">
            <div className="card plan-card shadow-sm">
              <div className="card-header bg-light">
                <h4 className="card-title">Plan Básico</h4>
              </div>
              <div className="card-body">
                <h2 className="card-price text-primary">$0 / mes</h2>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>Acceso a funcionalidades básicas</li>
                  <li>10 URLs cortas por mes</li>
                  <li>Soporte limitado por correo electrónico</li>
                </ul>
                {!token && (
                  <button
                    className="btn btn-outline-primary btn-block"
                    onClick={() => navigate('/register')}
                  >
                    Registrarse
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Plan Platino */}
          <div className="col-lg-4 col-md-6 col-12 mb-4">
            <div className="card plan-card shadow-sm">
              <div className="card-header bg-info text-white">
                <h4 className="card-title">Plan Platino</h4>
              </div>
              <div className="card-body">
                <h2 className="card-price text-info">$3.99 / mes</h2>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>Acceso a todas las funcionalidades</li>
                  <li>100 URLs cortas por mes</li>
                  <li>Soporte prioritario por correo</li>
                  <li>Estadísticas avanzadas</li>
                </ul>
                {membershipType === 'basic' ? (
                  <PayPalComponent membershipType="platino" onUpgrade={handleUpgrade} />
                ) : membershipType === 'platino' ? (
                  <h4 className="text-success">Plan Actual</h4>
                ) : membershipType === '' && (
                  <button
                    className="btn btn-outline-primary btn-block"
                    onClick={() => navigate('/register')}
                  >
                    Registrarse
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Plan Diamante */}
          <div className="col-lg-4 col-md-6 col-12 mb-4">
            <div className="card plan-card shadow-sm">
              <div className="card-header bg-dark text-white">
                <h4 className="card-title">Plan Diamante</h4>
              </div>
              <div className="card-body">
                <h2 className="card-price text-dark">$5.99 / mes</h2>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>Acceso ilimitado a todas las funcionalidades</li>
                  <li>URLs ilimitadas</li>
                  <li>Soporte 24/7</li>
                  <li>Estadísticas detalladas en tiempo real</li>
                  <li>Personalización de URLs</li>
                </ul>
                {membershipType === 'basic' || membershipType === 'platino' ? (
                  <PayPalComponent membershipType="diamante" onUpgrade={handleUpgrade} />
                ) : membershipType === 'diamante' ? (
                  <h4 className="text-success">Plan Actual</h4>
                ) : (
                  <button
                    className="btn btn-outline-primary btn-block"
                    onClick={() => navigate('/register')}
                  >
                    Registrarse
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Beneficios */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Beneficios de Nuestros Planes</h2>
        <div className="row">
          <div className="col-md-4 text-center p-4 benefit">
            <i className="fas fa-chart-line fa-3x mb-3 text-primary"></i>
            <h5 className="mb-2">Estadísticas en Tiempo Real</h5>
            <p>Monitorea tus URLs en tiempo real con estadísticas avanzadas.</p>
          </div>
          <div className="col-md-4 text-center p-4 benefit">
            <i className="fas fa-shield-alt fa-3x mb-3 text-info"></i>
            <h5 className="mb-2">Alta Seguridad</h5>
            <p>Tus datos están completamente seguros con cifrado avanzado.</p>
          </div>
          <div className="col-md-4 text-center p-4 benefit">
            <i className="fas fa-headset fa-3x mb-3 text-dark"></i>
            <h5 className="mb-2">Soporte 24/7</h5>
            <p>Disfruta de soporte técnico con un equipo dedicado.</p>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="container text-center my-5">
        <h2>¿Listo para empezar?</h2>
        <p>Elige el plan que mejor se ajuste a tus necesidades.</p>
        <button className="btn btn-lg btn-primary mt-3">Suscribirse Ahora</button>
      </div>
    </div>
  );
}

export default Subscripcion;