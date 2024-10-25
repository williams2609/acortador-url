import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import './Estilos/register.css'


function Register() {
    const [inputValue, setInputValue] = useState({
        name: '',
        email: '',
        password: '',
        repeatPassword: '',
        phoneNumber: '',
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess(false);
        let validationErrors = {};

        if (!inputValue.name) {
            validationErrors.name = 'El nombre es obligatorio';
        }
        if (!inputValue.email) {
            validationErrors.email = 'El email es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue.email)) {
            validationErrors.email = 'Formato de email inválido';
        }
        if (!inputValue.password) {
            validationErrors.password = 'La contraseña es obligatoria';
        } else if (inputValue.password.length < 6) {
            validationErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        if (inputValue.password !== inputValue.repeatPassword) {
            validationErrors.repeatPassword = 'Las contraseñas no coinciden';
        }
        if (!inputValue.phoneNumber) {
            validationErrors.phoneNumber = 'El número de teléfono es obligatorio';
        }

        if (Object.keys(validationErrors).length > 0) {
            return setErrors(validationErrors);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/users/register', {
                username: inputValue.name,
                password: inputValue.password,
                email: inputValue.email,
                phone_number: inputValue.phoneNumber
            });
            console.log(response.data);
            setSuccess(true);
        } catch (err) {
            const serverError = err.response?.data?.error || 'Error en el servidor';
            setErrors((prevErrors) => ({
                ...prevErrors,
                email: serverError.includes('email') ? serverError : prevErrors.email,
                name: serverError.includes('username') ? serverError : prevErrors.name,
            }));
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
            [name]: value
        });
    };

    return (
        <main className="login-container">
            <div className="login-form-wrapper">
                <h3>Crear Usuario</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input
                            type="text"
                            name="name"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            onChange={handleInput}
                            placeholder="Ingresa tu nombre"
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            onChange={handleInput}
                            placeholder="Ingresa tu email"
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>

                    <div className="form-group">
                        <label>Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            onChange={handleInput}
                            placeholder="Ingresa tu contraseña"
                        />
                        {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                    </div>

                    <div className="form-group">
                        <label>Repetir Contraseña</label>
                        <input
                            type="password"
                            name="repeatPassword"
                            className={`form-control ${errors.repeatPassword ? 'is-invalid' : ''}`}
                            onChange={handleInput}
                            placeholder="Repite tu contraseña"
                        />
                        {errors.repeatPassword && <div className="invalid-feedback">{errors.repeatPassword}</div>}
                    </div>

                    <div className="form-group">
                        <label>Número Móvil</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                            onChange={handleInput}
                            placeholder="Ingresa tu número móvil"
                        />
                        {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                    </div>

                    {success && <div className="alert alert-success">Usuario creado correctamente</div>}

                    <button type="submit" className="btn btn-primary btn-block">Crear Usuario</button>
                </form>
            </div>
        </main>
    );
}

export default Register