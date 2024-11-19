import { PayPalButtons } from '@paypal/react-paypal-js';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalComponent from '../Componentes/PaypalComponent';
import axios from 'axios';
import './Estilos/subscripcion.css';

function Subscripcion() {
  const [userId, setUserId] = useState('');
  const [membershipType, setMembershipType] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const plans = [
    {
      name: "Básico",
      price: "$0 / mes",
      recommendedFor: "Principiantes",
      features: {
        enlacesCortos: "10",
        enlacesPersonalizados: "1",
        enlacesModificados: "Sin Acceso",
        codigosQr: "2 (Con Marca)",
        desecharEnlaces: "No disponible",
        graficos: "Básico",
      },
    },
    {
      name: "Platino",
      price: "$2.99 / mes",
      recommendedFor: "Trabajadores autónomos",
      features: {
        enlacesCortos: "50",
        enlacesPersonalizados: "10",
        enlacesModificados: "5",
        codigosQr: "5",
        desecharEnlaces: "Ilimitado",
        graficos: "Avanzado",
      },
    },
    {
      name: "Diamante",
      price: "$5.99 / mes",
      recommendedFor: "Pequeñas Empresas",
      features: {
        enlacesCortos: "1000",
        enlacesPersonalizados: "Ilimitado",
        enlacesModificados: "Ilimitado",
        codigosQr: "50",
        desecharEnlaces: "Ilimitado",
        graficos: "Tiempo Real",
      },
    },
  ];

  const fetchData = async () => {
    if (!token) {
      return console.error('Sin token de verificación');
    }
    try {
      const response = await axios.get('http://localhost:5000/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      <div className="jumbotron text-center text-white py-5 bg-gradient" style={{ marginTop: '100px' }}>
        <h1 className="display-4" style={{ color: 'black' }}>Elige el Plan de Suscripción Perfecto para Ti</h1>
        <p className="lead" style={{ color: 'black' }}>Descubre todas las ventajas que ofrecemos con nuestros planes.</p>
      </div>

      {/* Opciones de Planes */}
      <div className="container my-5">
        <div className="row text-center">
          {plans.map((plan, index) => (
            <div className="col-lg-4 col-md-6 col-12 mb-4" key={index}>
              <div className="card plan-card shadow-sm">
                <div className={`card-header ${index === 0 ? "bg-light" : index === 1 ? "bg-info text-white" : "bg-dark text-white"}`}>
                  <h4 className="card-title">{plan.name}</h4>
                </div>
                <div className="card-body">
                  <h2 className={`card-price text-${index === 0 ? "primary" : index === 1 ? "info" : "dark"}`}>{plan.price}</h2>
                  <ul className="list-unstyled mt-3 mb-4">
                    <li>Enlaces Cortos: {plan.features.enlacesCortos}</li>
                    <li>Enlaces Personalizados: {plan.features.enlacesPersonalizados}</li>
                    <li>Codigos Qr: {plan.features.codigosQr}</li>
                    <li>Desechar Enlaces: {plan.features.desecharEnlaces}</li>
                  </ul>
                  {membershipType === "basic" && index > 0 ? (
                    <PayPalComponent membershipType={plan.name.toLowerCase()} onUpgrade={handleUpgrade} />
                  ) : membershipType.toLowerCase() === plan.name.toLowerCase() ? (
                    <h4 className="text-success">Plan Actual</h4>
                  ) : (
                    <button className="btn btn-outline-primary btn-block" onClick={() => navigate("/register")}>
                      Registrarse
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla de Comparación */}
      <table className="custom-table">
        <thead>
          <tr>
            <th></th>
            {plans.map((plan, index) => (
              <th key={index}>{plan.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Plan Mensual</td>
            {plans.map((plan, index) => (
              <td key={index} style={{ color: "black" }}>
                <strong style={{ fontSize: "2.2rem" }}>{plan.price}</strong>
              </td>
            ))}
          </tr>
          <tr>
      <td></td>
      <td>{!token && (
                  <button
                    className="btn btn-outline-primary btn-block rounded-5 btn-table"
                    onClick={() => navigate('/register')}
                  >
                    Registrarse
                  </button>
                )}</td>
      <td>{membershipType === 'basic' ? (
                  <PayPalComponent membershipType="platino" onUpgrade={handleUpgrade} />
                ) : membershipType === 'platino' ? (
                  <h4 className="text-success">Plan Actual</h4>
                ) : membershipType === '' && (
                  <button
                    className="btn btn-outline-primary btn-block rounded-5 btn-table"
                    onClick={() => navigate('/register')}
                  >
                    Registrarse
                  </button>
                )}</td>
      <td>{membershipType === 'basic' || membershipType === 'platino' ? (
                  <PayPalComponent membershipType="diamante" onUpgrade={handleUpgrade} />
                ) : membershipType === 'diamante' ? (
                  <h4 className="text-success">Plan Actual</h4>
                ) : (
                  <button
                    className="btn btn-outline-primary btn-block rounded-5 btn-table"
                    onClick={() => navigate('/register')}
                  >
                    Registrarse
                  </button>
                )}</td>
     </tr>
          <tr>
            
            <td>Recomendado Para</td>
            {plans.map((plan, index) => (
              <td key={index}>{plan.recommendedFor}</td>
            ))}
          </tr>
          <tr className="linea-1 caracteristicas">
            <td className="negrita" style={{ fontSize: "1rem" }}>Características</td>
          </tr>
          {Object.keys(plans[0].features).map((feature, featureIndex) => (
            <tr key={featureIndex}>
              <td>{feature.replace(/([A-Z])/g, " $1")}</td>
              {plans.map((plan, index) => (
                <td key={index}>{plan.features[feature]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
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