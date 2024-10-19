import React, { useState } from 'react'
import './Estilos/home.css'
import axios from 'axios'
function Home() {

const [isPaid,setIsPaid]= useState(false)
const [shortUrl,setShortUrl]= useState("")
const [originalUrl,setOriginalUrl]=useState("")
const [error,setError] = useState(false)
const [expire,setExpire]= useState("")

const handleInputUrl = async (e)=>{
	e.preventDefault();
	setError("")
	try{	
			const response = await axios.post("http://localhost:5000/acortar",{
			original_url:originalUrl,
			is_paid_user: isPaid
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
    <div  className=''>
			<div className='contenedor-input mt-5 d-flex align-items-center justify-content-center'>
				<form onSubmit={handleInputUrl}>
				<input className='input-acortador rounded-3'
				type='text'
				name='originalUrl'
				value={originalUrl}
				placeholder='Ingrese Una Url'
				onChange={(e)=> setOriginalUrl(e.target.value)}
				></input>
				<button className='btn btn-primary'
				>Acortar URL</button>
				{shortUrl &&
				<label>URL Acortada
					<a href={`http://localhost:5000/${shortUrl}`} target='blanc' rel='noopener noreferrer'>{shortUrl}</a>
					<p>Fecha De expiracion: {expire}</p>
				</label> }
				{error && <p>{error}</p>}
				</form>
			</div>
    </div>
  )
}

export default Home