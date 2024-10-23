import React from 'react'
import './Estilos/Navbar.css'
import { Link } from 'react-router-dom'

function BarraNavegacion() {
  return (
    <nav className='navbarr w-100 p-3'>
        <div className='contenedor-items container d-flex justify-content-between'>
        <div className='logo-navbar'>
        <Link to="/" className='m-0 logo'><strong>URLify</strong></Link>
        </div>
        <div className='links'>
            links
        </div>
        <div>
            opciones
        </div>
        </div>
    </nav>
  )
}

export default BarraNavegacion