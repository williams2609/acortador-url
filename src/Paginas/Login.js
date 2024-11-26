import React, { useState } from 'react';
import './Estilos/login.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Componentes/AuthProvider';


function Login() {
    const [inputValue, setInputValue] = useState({
        name: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
		const [success,setSuccess]= useState("")
		const navigate = useNavigate()

    const {login} = useAuth()

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value
        });
    };

		const handleNavigate = () => navigate('/register')


    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};
				setSuccess("")
        // Validar Email
        if (!inputValue.name) {
            validationErrors.name = 'Ingrese un nombre de usuario';
        }
        

        // Validar Contraseña
        if (!inputValue.password) {
            validationErrors.password = "La contraseña es obligatoria";
        }

        if (Object.keys(validationErrors).length > 0) {
            return setErrors(validationErrors);
        }

        // Resetear errores si el formulario es válido
        setErrors({});
				try{
						const response = await axios.post('http://api-urlify.uk:/users/login',{
							username: inputValue.name,
							password: inputValue.password
						})
						console.log(response.data)
						setSuccess(response.data.message)
                        const {token} = response.data
                        login(token)
                        localStorage.setItem('token',token);
                        console.log(token)
                        navigate('/perfil')
				}catch(err){
					setErrors(err)
				}

    };

    return (
        <div className="contenedor-login d-flex justify-content-center align-items-center">
            <div className="login-form-wrapper">
                <h3>Iniciar Sesión</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="mb-2">Nombre De Usuario:</label>
                        <input
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            name="name"
                            type="text"
                            value={inputValue.name}
                            onChange={handleInput}
                            placeholder="Ingresa tu nombre"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}

                        <label className="mt-3 mb-2">Contraseña:</label>
                        <input
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            name="password"
                            type="password"
                            value={inputValue.password}
                            onChange={handleInput}
                            placeholder="Ingresa tu contraseña"
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>
										{success && <p className='alert alert-success mt-3'>{success}</p>}
                    <button type="submit" className="btn btn-primary mt-4">Ingresar</button>
                </form>
            </div>
						<div className='contenedor-register d-flex align-items-center mb-2'>
						<div className='separador mt-3 me-3'></div>
						<div className='mt-3'>No tienes Cuenta</div>
						<div className='separador mt-3 ms-3'></div>
						</div>
						<div>
							<a className='boton-register border p-2 rounded-3' onClick={handleNavigate}><strong>Registrate</strong></a>
						</div>
        </div>
    );
}

export default Login;