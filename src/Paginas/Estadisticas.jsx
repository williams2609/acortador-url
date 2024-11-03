import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UrlChart from '../Componentes/UrlChart';
import ClickChart from '../Componentes/ClickChart';

function Estadisticas() {
  const [urls, setUrls] = useState([]);
  const [userData, setUserData] = useState({});
  const [viewOption, setViewOption] = useState('total');;

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [userResponse, urlResponse] = await Promise.all([
        axios.get('http://localhost:5000/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/user-urls', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setUserData(userResponse.data);
      setUrls(Array.isArray(urlResponse.data) ? urlResponse.data : []);
    } catch (err) {
      console.error('Error al intentar acceder a los datos del usuario:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [viewOption]);
console.log(userData)
console.log(urls)
  return (
    <div>
      <h3>Estadísticas de URLs Acortadas</h3>
      {userData.createdAt && urls.length > 0 ? (
        <UrlChart urls={urls} createdAt={userData.createdAt} />
      ) : (
        <p>Cargando datos de URLs...</p>
      )}
      <h3>Estadísticas de Clics en URLs</h3>

      <label>
                Ver clics:
                <select value={viewOption} onChange={(e) => setViewOption(e.target.value)}>
                    <option value="total">Total</option>
                    <option value="day">Por Día</option>
                    <option value="hour">Por Hora</option>
                </select>
            </label>
      {urls.length > 0 ? (
        <ClickChart urls={urls} />
      ) : (
        <p>Cargando datos de clics...</p>
      )}
    </div>
  );
}

export default Estadisticas;