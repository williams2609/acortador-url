import React, { useState } from 'react'
import './Estilos/home.css'
import axios from 'axios'
import logo from './imagenes/graf-removebg-preview.png'
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import grafico from './imagenes/grafico.png'

function Home() {

const [isPaid,setIsPaid]= useState(false)
const [shortUrl,setShortUrl]= useState("")
const [originalUrl,setOriginalUrl]= useState("")
const [error,setError] = useState(false)
const [expire,setExpire]= useState("")

const handleInputUrl = async (e)=>{
	e.preventDefault();
	setError('')
	setShortUrl('');
	setExpire('')

    const token = localStorage.getItem('token')
    

        let formatedUrl = originalUrl.trim(); // Remueve espacios adicionales
    
        // Verifica si la URL no comienza con "http://" o "https://"
        if (!/^https?:\/\//i.test(formatedUrl)) {
            formatedUrl = `https://${formatedUrl}`; // Añade el prefijo solo si falta
        }

	try{	
			const response = await axios.post("http://localhost:5000/acortar",{
			original_url: formatedUrl,
			is_paid_user: isPaid
		}, {
            headers: {
                Authorization: `Bearer ${token}` // Incluyendo el token en el encabezado
            }
    });
		setShortUrl(`${response.data.short_url}`)
        
		if(response.data.expiration_date){
			const expiration = new Date(response.data.expiration_date)
			setExpire(expiration.toLocaleString())
		}else if(isPaid){
			setExpire("Sin Fecha De Expiracion")
		}
		

	}catch(error){
		setError(error.response ? error.response.data.error : "Error Al Acortar El Url")
	}
};



  return (
    <div  className='contenedor-home'>
				<section className='seccion-entrada'>
    <div className='container-fluid'>
		<section className='seccion-entrada'>
    <div className='container'>
        <section className='row'>
            <div className='col-lg-6 col-12 contenedor-titulo-entrada mt-5'>
                <h1 className='mt-5 ms-5 titulo-principal'>
                    Simplifica tu Experiencia en Línea con URLs Cortas
                </h1>
                <h2 className='ms-5 subtitulo mb-4'>
                    Convierte enlaces largos en algo manejable y atractivo.
                </h2>
                <p className='ms-5 descripcion mb-4'>
                    "Con <strong style={{color:"blueviolet"}}>URLify</strong>, acortar enlaces largos es un juego de niños. No solo puedes reducir tus URLs, sino que también puedes crear enlaces personalizados y editarlos cuando lo necesites. Optimiza tu forma de compartir en la web y haz que tus enlaces destaquen. ¡Únete a la revolución de los enlaces cortos y mejora tu presencia en línea!"
                </p>
                <ul className='ms-5 lista-caracteristicas'>
                    <li>✨ **Enlaces Personalizados**: Crea URLs únicas que reflejen tu marca.</li>
                    <li>🔗 **Análisis de Enlaces**: Monitorea el rendimiento de tus URLs.</li>
                    <li>🔒 **Seguridad Aumentada**: Protege tus enlaces con medidas de seguridad adicionales.</li>
                </ul>
                <div className='d-flex justify-content-start mt-4 ms-5 mb-4 mt-5'>
                    <a href="/Subscripción" className='boton-prueba btn btn-lg mt-5'style={{color:'white'}}>¡Prueba URLify Gratis Ahora!</a>
                </div>
            </div>
            <div className='col-lg-5 col-12 contenedor-imagen-logo d-flex align-items-start'>
                <img className='logo-url mt-5 img-fluid' src={logo} alt="Logo de URLify" />
            </div>
        </section>
    </div>
</section>
    </div>
</section>
<section className='seccion-acortador-links text-center'>
    <h1 className='mt-5'>Acorta tus Enlaces de Manera Fácil y Rápida</h1>
    <h3 className='mt-3' style={{ fontFamily: "sans" }}>
        Ingresa tu URL larga y transforma tu enlace en uno corto y manejable en segundos.
    </h3>
    
    <div className='contenedor-input mt-5 d-flex align-items-center justify-content-center'>
        <form onSubmit={handleInputUrl} className='p-4 rounded-4 border shadow'style={{backgroundColor:"white"}}>
            <div className='mb-3 text-center'>
                <h4 className='m-2 titulo-carta'> Acorta Tus URLs Totalmente Gratis</h4>
                <p className='text-muted' style={{fontFamily:"sans"}}>Con nuestra herramienta, puedes crear enlaces más cortos y fáciles de compartir. Ideal para redes sociales, correos electrónicos y más.</p>
            </div>
						<div className='d-flex justify-content-center mt-5'>
            <input
                className='input-acortador rounded-3'
                type='text'
                name='originalUrl'
                value={originalUrl}
                placeholder='Ingrese una URL larga'
                onChange={(e)=> setOriginalUrl(e.target.value)}
                required
            />

            <button className='btn btn-primary'>Obten Tu Url Acortada</button>
            </div>
            {shortUrl && (
                <div className='mt-4 d-flex text-center align-items-center justify-content-center'style={{flexDirection:"column"}}>
                    <div className='d-flex'>
                    <label className='d-block me-2'>URL Acortada</label>
                    <a href={`http://localhost:5000/${shortUrl}`} target='_blank' rel='noopener noreferrer'>
                        <p className='short-url'>{`http://localhost:5000/url/${shortUrl}`}</p>
                    </a>
                    </div>
                    <p className='text-muted'>Fecha de expiración: {expire}</p>
                </div>
            )}
            
            {error &&<div className='d-flex text-center justify-content-center'> <Alert className='mt-3' variant='danger' style={{minWidth:"400px"}}>{error}</Alert></div>}
						<div className='text-start mt-5'>
                        <Link className="border rounded-5 p-2 mt-3 link-url-personalizadas" to="Subscripción">Urls Personalizadas <i className='bi bi-arrow-right'></i></Link>
                        </div>
                        <div className='d-flex mt-5 justify-content-between'>
						<span className='mt-2'style={{fontSize:"0.8rem"}}>Obten hasta 10 url Totalmente Gratis al mes</span>
						<a href="/Subscripción" className='boton-subscripcion bg-warning border rounded-3 p-2 shadow'>Urls Ilimitadas y sin Caducidad <i className='bi bi-arrow-right'></i>
						</a>
                        </div>
        </form>
    </div>
    
    <div className='mt-5'>
        <h4>¿Por Qué Usar Nuestro Acortador de URLs?</h4>
        <ul className='list-unstyled'>
            <li>🔗 <strong>Fácil de Usar:</strong> Simplemente ingresa tu enlace y obtén uno corto en segundos.</li>
            <li>📊 <strong>Análisis de Rendimiento:</strong> Realiza un seguimiento de los clics y el rendimiento de tus enlaces.</li>
            <li>🛡️ <strong>Seguridad Mejorada:</strong> Enlaces cortos seguros con protección contra spam.</li>
            <li>✏️ <strong>Enlaces Personalizados:</strong> Crea URLs que reflejen tu marca o mensaje.</li>
        </ul>
    </div>
    <div className='contenedor-grafico'>
			<div className='contenedor-descripcion-grafico'>
			<h3>Sigue Desde Cerca Cada Url</h3>
			<p>En Nuestra plataforma puedes hacer seguimiento de tus url,la Cantidad De clicks totales, diarios o por horas </p>
			</div>
			<div className='contenedor-grafico'>
				<img src={grafico} className='img-fluid rounded-3'></img>

			</div>
		</div>   
    <div className='mt-5'>
        <h4>Testimonios de Nuestros Usuarios</h4>
        <blockquote className='blockquote'>
            <p className='mb-0'>“Usar este acortador de URLs ha cambiado la forma en que comparto mis enlaces. ¡Totalmente recomendado!”</p>
            <footer className='blockquote-footer'>María López, Blogger</footer>
        </blockquote>
        <blockquote className='blockquote'>
            <p className='mb-0'>“La facilidad de personalizar mis enlaces ha hecho que mi marca se vea más profesional.”</p>
            <footer className='blockquote-footer'>Javier Pérez, Emprendedor</footer>
        </blockquote>
    </div>
</section>
    </div>
  )
}

export default Home