import React, { useState } from 'react';
import axios from 'axios';
import './popup.css'

const Popup = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('token')
  );
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [success, setSuccess] = useState('');

  // Manejar inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/users/login', {
        username: name,
        password: password,
      });

      const token = response.data.token;
      localStorage.setItem('token', token); // Guardar el token
      setIsAuthenticated(true); // Cambiar a pantalla de acortar URL
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión.');
    }
  };

  // Manejar acortar URL
  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    setShortenedUrl('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Debes iniciar sesión primero.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/acortar',
        {
          original_url: originalUrl,
          short_url: customUrl || undefined,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShortenedUrl(response.data.short_url);
      setSuccess('URL acortada con éxito');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al intentar acortar la URL.');
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="popup-container">
    {isAuthenticated ? (
      <div className="url-shortener">
        <h2 className="title">Acortar URL</h2>
        <form onSubmit={handleShorten}>
          <div className="form-group">
            <label className="label">URL Original:</label>
            <input
              type="text"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="label">URL Personalizada (Opcional):</label>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="input"
            />
          </div>
          <button type="submit" className="btn btn-primary">Acortar</button>
        </form>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        {shortenedUrl && (
          <p className="shortened-url">
            URL Acortada:{' '}
            <a
              href={`http://localhost:5000/${shortenedUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="url-link"
            >
              {`http://localhost:5000/${shortenedUrl}`}
            </a>
          </p>
        )}
        <button onClick={handleLogout} className="btn btn-secondary">Cerrar Sesión</button>
      </div>
    ) : (
      <div className="login">
        <h2 className="title">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="label">Nombre De Usuario:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <label className="label">Contraseña:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
            />
          </div>
          <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    )}
  </div>
  );
};

export default Popup;