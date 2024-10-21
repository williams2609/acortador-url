import React from 'react'
import './Estilos/Navbar.css'

function BarraNavegacion() {
  return (
    <nav className='navbarr w-100 p-3'>
        <div className='contenedor-items container d-flex justify-content-between'>
        <div className='logo-navbar'>
        <p className='m-0 logo'><strong>URLify</strong></p>
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