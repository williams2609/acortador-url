import { PayPalButtons } from '@paypal/react-paypal-js'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PayPalComponent from '../Componentes/PaypalComponent'
import axios from 'axios'

function Subscripcion() {

  const [userId,setUserId]= useState('');
  const [membershipType,setMembershipType]= useState('');
  const fetchData = async()=>{
    const token = localStorage.getItem('token')
    if(!token){
      return console.error('Sin token de verificacion')
    }

    try{
      const response = await axios.get('http://localhost:5000/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(response.data)
      setUserId(response.data.id)
      setMembershipType(response.data.subscriptionType)
    }catch(err){
      return console.error('Error al intentar acceder al usuario',err)
    }
  }
useEffect(()=>{
  fetchData()
},[])
  const navigate = useNavigate()

const handleUpgrade = async (membership) => {
  console.log(membership)
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/users/upgrade', 
            { userId, membership },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log(response.data.message); // Mensaje de éxito
    } catch (err) {
        console.error('Error al actualizar la suscripción:', err);
    }
};
  return (
    <div className="subscripcion">
    {/* Banner Inicial */}
    <div className="jumbotron text-center text-white py-5 mt-5" style={{color: 'black'}}>
      <h1 className="display-4" style={{color: 'black'}}>¡Elige tu Plan de Suscripción!</h1>
      <p className="lead" style={{color: 'black'}}>Descubre todas las ventajas que ofrecemos con nuestros planes de suscripción mensual.</p>
    </div>

    {/* Sección de Opciones de Planes */}
    <div className="container my-5">
      <div className="row text-center">
        {/* Plan Básico */}
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-header bg-light">
              <h4 className="card-title">Plan Gratuito</h4>
            </div>
            <div className="card-body">
              <h2 className="card-price">$0 / mes</h2>
              <ul className="list-unstyled mt-3 mb-4">
                <li>Acceso a funcionalidades básicas</li>
                <li>10 URLs cortas por mes</li>
                <li>Soporte limitado por correo electrónico</li>
              </ul>
              <button className="btn btn-outline-primary btn-block" onClick={()=>navigate('/register')}>Seleccionar</button>
            </div>
          </div>
        </div>

        {/* Plan Intermedio */}
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-header bg-info text-white">
              <h4 className="card-title">Plan Platino</h4>
            </div>
            <div className="card-body">
              <h2 className="card-price">$3.99 / mes</h2>
              <ul className="list-unstyled mt-3 mb-4">
                <li>Acceso a todas las funcionalidades</li>
                <li>100 URLs cortas por mes</li>
                <li>Soporte prioritario por correo</li>
                <li>Estadísticas avanzadas</li>
              </ul>
              <PayPalComponent membershipType='platino' onUpgrade={handleUpgrade}></PayPalComponent>
            </div>
          </div>
        </div>

        {/* Plan Premium */}
        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-header bg-dark text-white">
              <h4 className="card-title">Plan Diamante</h4>
            </div>
            <div className="card-body">
              <h2 className="card-price">$5.99 / mes</h2>
              <ul className="list-unstyled mt-3 mb-4">
                <li>Acceso ilimitado a todas las funcionalidades</li>
                <li>URLs ilimitadas</li>
                <li>Soporte 24/7</li>
                <li>Estadísticas detalladas en tiempo real</li>
                <li>Personalización de URLs</li>
              </ul>
              <PayPalComponent membershipType='diamante' onUpgrade={handleUpgrade}></PayPalComponent>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Sección de Beneficios */}
    <div className="container mt-5">
      <h2 className="text-center mb-4">Beneficios de Nuestros Planes</h2>
      <div className="row">
        {/* Beneficio 1 */}
        <div className="col-md-4">
          <div className="benefit-item text-center p-4">
            <i className="fas fa-chart-line fa-3x mb-3 text-primary"></i>
            <h5 className="mb-2">Estadísticas en Tiempo Real</h5>
            <p>Monitorea tus URLs en tiempo real con estadísticas avanzadas y gráficas fáciles de entender.</p>
          </div>
        </div>
        
        {/* Beneficio 2 */}
        <div className="col-md-4">
          <div className="benefit-item text-center p-4">
            <i className="fas fa-shield-alt fa-3x mb-3 text-info"></i>
            <h5 className="mb-2">Alta Seguridad</h5>
            <p>Tus datos están completamente seguros con nosotros. Usamos cifrado de última generación.</p>
          </div>
        </div>

        {/* Beneficio 3 */}
        <div className="col-md-4">
          <div className="benefit-item text-center p-4">
            <i className="fas fa-headset fa-3x mb-3 text-dark"></i>
            <h5 className="mb-2">Soporte al Cliente</h5>
            <p>Disfruta de soporte técnico rápido y eficiente con nuestro equipo disponible 24/7.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Llamada a la Acción */}
    <div className="container text-center my-5">
      <h2>¿Listo para empezar?</h2>
      <p>Elige el plan que mejor se ajuste a tus necesidades y comienza a acortar tus URLs de forma rápida y segura.</p>
      <button className="btn btn-lg btn-primary mt-3">Suscribirse Ahora</button>
    </div>
  </div>
  )
}

export default Subscripcion