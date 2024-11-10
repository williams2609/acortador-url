import React, { useState } from 'react'
import './Estilos/home.css'
import axios from 'axios'
import logo from './imagenes/graf-removebg-preview.png'
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';
import grafico from './imagenes/grafico.png'

function Home() {

    const [isPaid, setIsPaid] = useState(false)
    const [shortUrl, setShortUrl] = useState("")
    const [originalUrl, setOriginalUrl] = useState("")
    const [error, setError] = useState(false)
    const [expire, setExpire] = useState("")
    const [ ModifyUrl,setModifiUrl ] = useState() 
    
console.log(error)
    const handleInputUrl = async (e) => {
        e.preventDefault();
        setError('')
        setShortUrl('');
        setExpire('')

        const token = localStorage.getItem('token')

        let formatedUrl = originalUrl.trim();

        if (!/^https?:\/\//i.test(formatedUrl)) {
            formatedUrl = `https://${formatedUrl}`;
        }

        try {
            const response = await axios.post("http://localhost:5000/acortar", {
                original_url: formatedUrl,
                is_paid_user: isPaid,
                short_url: ModifyUrl
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
           if(!shortUrl){
            setShortUrl(`${response.data.short_url}`)
            }

            if (response.data.expiration_date) {
                const expiration = new Date(response.data.expiration_date)
                setExpire(expiration.toLocaleString())
            } else if (isPaid) {
                setExpire("Sin Fecha De Expiracion")
            }

        } catch (error) {
            setError(error.response ? error.response.data.error : "Error Al Acortar El Url")
        }
    };

    return (
        <div className='contenedor-home'>
            <section className='hero'>
                <div className='container text-center'>
                    <h1 className='display-4 mt-5'>Transforma Tus Enlaces con URLify</h1>
                    <p className='lead mt-3'>Convierte enlaces largos en algo manejable y atractivo, perfecto para redes sociales, emails y más.</p>
                    <a href="/Subscripción" className='btn btn-lg boton-prueba' style={{marginTop:'100px'}}>¡Prueba URLify Gratis Ahora!</a>
                </div>
            </section>

            <section className='features mt-5'>
                <div className='container'>
                    <div className='row text-center'>
                        <div className='col-md-4'>
                            <i className='bi bi-link-45deg feature-icon'></i>
                            <h3>Enlaces Personalizados</h3>
                            <p>Crea URLs únicas que reflejen tu marca y estilo.</p>
                        </div>
                        <div className='col-md-4'>
                            <i className='bi bi-graph-up feature-icon'></i>
                            <h3>Analiza el Rendimiento</h3>
                            <p>Obtén datos detallados sobre los clics y optimiza tus enlaces.</p>
                        </div>
                        <div className='col-md-4'>
                            <i className='bi bi-shield-lock feature-icon'></i>
                            <h3>Seguridad Aumentada</h3>
                            <p>Protege tus enlaces con tecnología avanzada y medidas de seguridad.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className='shorten-url text-center'>
                <h2>Acorta tu URL en segundos</h2>
          
                <form onSubmit={handleInputUrl} className="form-url d-flex flex-column align-items-center">
    <div className="d-flex flex-column align-items-start" style={{ width: '100%', maxWidth: '700px' }}>
        {/* Contenedor del primer input y el botón */}
        <div className="d-flex w-100 align-items-center mb-3">
            <input
                type="text"
                name="originalUrl"
                value={originalUrl}
                placeholder="Ingrese una URL larga"
                onChange={(e) => setOriginalUrl(e.target.value)}
                required
                className="input-url"
                style={{ flex: 1, marginRight: '10px' }} // Espacio entre el input y el botón
            />
            <button className="btn btn-primary btn-short" style={{ width: '130px' }}>
                Acortar URL
            </button>
        </div>

        {/* Segundo input centrado debajo */}
        <input
            type="text"
            name="short_url"
            className="input-url"
            placeholder="URL Personalizada"
            style={{ width: '80%' }} // Asegura que el segundo input ocupe todo el ancho
           onChange={(e)=>setModifiUrl(e.target.value)}
        />
    </div> 
</form>
                {shortUrl && (
                    <div className='result mt-3'>
                        <label>URL Acortada</label>
                        <a href={`http://localhost:5000/${shortUrl}`} target='_blank' rel='noopener noreferrer'>
                            <p className='short-url' style={{color:'blue'}}>{`http://localhost:5000/url/${shortUrl}`}</p>
                        </a>
                        <p>Fecha de expiración: {expire}</p>
                    </div>
                )}
                {error && (
    <Alert variant='danger' className='mt-3'>
        {error !== 'Token no válido' 
            ? error || "Ocurrió un error" // Muestra el mensaje de error si está disponible
            : "Necesitas Crear Una Cuenta"}
    </Alert>
)}
            </section>

            <section className='monitor'>
                <div className='container d-flex'>
                    <div className='description'>
                        <h3>Monitorea el Rendimiento de Cada URL en Tiempo Real</h3>
                        <p>Accede a estadísticas detalladas y optimiza el alcance de tus enlaces de forma fácil y efectiva.</p>
                    </div>
                    <div className='graphic'>
                        <img src={grafico} alt="Gráfico de Seguimiento de URL" className="img-fluid rounded-3 shadow" />
                    </div>
                </div>
            </section>

            <section className='testimonials text-center mt-5'>
                <h4>Testimonios de Nuestros Usuarios</h4>
                <blockquote className='blockquote'>
                    <p>“Usar este acortador ha cambiado la forma en que comparto enlaces. ¡Totalmente recomendado!”</p>
                    <footer>María López, Blogger</footer>
                </blockquote>
                <blockquote className='blockquote'>
                    <p>“Personalizar enlaces ha hecho que mi marca se vea más profesional.”</p>
                    <footer>Javier Pérez, Emprendedor</footer>
                </blockquote>
            </section>
        </div>
    )
}

export default Home;