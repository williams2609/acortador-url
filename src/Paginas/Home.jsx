import React, { useEffect, useState } from 'react'
import './Estilos/home.css'
import axios from 'axios'
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import grafico from './imagenes/grafico.png'
import ejemp1 from './imagenes/Captura de pantalla 2024-11-12 104129.png'
import ejemp2 from './imagenes/Captura de pantalla 2024-11-12 104141.png'

// Imágenes de ejemplo


function Home() {
    const [isPaid, setIsPaid] = useState(false)
    const [shortUrl, setShortUrl] = useState("")
    const [originalUrl, setOriginalUrl] = useState("")
    const [error, setError] = useState(false)
    const [expire, setExpire] = useState("")
    const [ModifyUrl, setModifiUrl] = useState()
    const [userData, setUserData] = useState('')
    const [ isLogged,setIsLogged ] = useState(false)
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    console.log(token)

    const confirmToken = () => {
       if(isLogged !== null){
        return setIsLogged(true)
       }
    }
		


    const fetchUser = async ()=>{
			try{
					const userResponse = await axios.get('http://api-urlify.uk/users/me', {
							headers: {
									Authorization: `Bearer ${token}`
							}
					})
	setUserData(userResponse.data)
	setIsPaid(userData.is_paid_user)
			}catch(err){
				setError(err.response.data.error)
				console.error('error Al intentar acceder a los datos del usuario',err)
			}
		}
		
        useEffect(()=>{
            confirmToken();
            if (isLogged){
                fetchUser()
            }
		},[])
useEffect(()=>{
    if(error === 'Token invalido'){
        const timeout = setTimeout(()=>{
            navigate('/register')
        },3000)
        return () => clearTimeout(timeout)
    }
},[error,navigate])

    const handleInputUrl = async (e) => {
        e.preventDefault();
        setError('')
        setShortUrl('');
        setExpire('')


        let formatedUrl = originalUrl.trim();

        if (!/^https?:\/\//i.test(formatedUrl)) {
            formatedUrl = `https://${formatedUrl}`;
        }

        try {
            const userResponse = await axios.get('http://api-urlify.uk/users/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
    setUserData(userResponse.data)
    setIsPaid(userData.is_paid_user)

            const response = await axios.post("http://api-urlify.uk/acortar", {
                original_url: formatedUrl,
                short_url: ModifyUrl,
                requestType: 'shorten'
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
		console.log('paga?',isPaid)
		console.log(userData)
    return (
        <div className='contenedor-home'>
            {/* Hero Section */}
            <section className='hero'>
                <div className='container text-center'>
                    <h1 className='display-4 mt-5'>Transforma Tus Enlaces con URLify</h1>
                    <p className='lead mt-3'>Convierte enlaces largos en algo manejable y atractivo, perfecto para redes sociales, emails y más.</p>
                    <a href="/Subscripción" className='btn btn-lg boton-prueba' style={{marginTop:'100px'}}>¡Prueba URLify Gratis Ahora!</a>
                </div>
            </section>

            {/* Features Section */}
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

            {/* URL Shortener Section */}
            <section className='shorten-url text-center mb-5 mt-5'>
                <h2>Acorta tu URL en segundos</h2>
                <form onSubmit={handleInputUrl} className="form-url d-flex flex-column align-items-center">
                    <div className="d-flex flex-column align-items-start" style={{ width: '100%', maxWidth: '700px' }}>
                        <div className="d-flex w-100 align-items-center mb-3">
                            <input
                                type="text"
                                name="originalUrl"
                                value={originalUrl}
                                placeholder="Ingrese una URL larga"
                                onChange={(e) => setOriginalUrl(e.target.value)}
                                required
                                className="input-url"
                                style={{ flex: 1, marginRight: '10px' }}
                            />
                            <button className="btn btn-primary btn-short" style={{ width: '130px' }}>
                                Acortar URL
                            </button>
                        </div>

                        <input
                            type="text"
                            name="short_url"
                            className="input-url"
                            placeholder="URL Personalizada (opcional)"
                            style={{ width: '80%' }}
                            onChange={(e) => setModifiUrl(e.target.value)}
                        />
                        
                    </div> 
                </form>
                {shortUrl && (
                    <div className='result mt-3'>
                        <label>URL Acortada</label>
                        <a href={`http://api-urlify.uk/${shortUrl}`} target='_blank' rel='noopener noreferrer'>
                            <p className='short-url' style={{color:'blue'}}>{`http://api-urlify.uk/${shortUrl}`}</p>
                        </a>
												{isPaid ? <p>Sin Fecha De Expiración</p> : <p>Fecha de expiración: {expire}</p>}
                        
                    </div>
                )}
                {error && (
                    <Alert variant='danger' className='mt-3'>
                        {error !== 'Token invalido' ? error || "Ocurrió un error" : "Necesitas Crear Una Cuenta"}
                    </Alert>
                )}
            </section>

            {/* Monitor Section */}
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

            {/* Tutorial Section */}
            <section className='tutorial-section text-center mt-5'>
                <h3>Cómo Modificar una URL y Generar un Código QR</h3>
                <div className="instruction">
                    <div className="instruction-text">
                        <h4>1. Modificar una URL</h4>
                        <p>Para modificar una URL,Ve a la Seccion de Perfil, haz clic en el icono de edición junto a la URL que deseas cambiar. Luego, escribe la nueva URL corta y presiona "Guardar".</p>
                    </div>
                    <div className="instruction-image">
                        <img src={ejemp2} alt="Ejemplo de cómo modificar una URL" className="img-fluid rounded-3 shadow" />
                    </div>
                </div>
                <div className="instruction">
                    <div className="instruction-text">
                        <h4>2. Generar un Código QR</h4>
                        <p>Para crear un código QR de tu URL, selecciona la opción "Generar QR" junto a la URL que has acortado. Si tienes una suscripción válida, el código QR aparecerá junto a la URL en tu lista.</p>
                    </div>
                    <div className="instruction-image">
                        <img src={ejemp1} alt="Ejemplo de cómo generar un código QR" className="img-fluid rounded-3 shadow" />
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
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