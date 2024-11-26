import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ClickChart from '../Componentes/ClickChart';
import './Estilos/estadisticas.css';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import TotalClicksChart from '../Componentes/totalClickChart';

function Estadisticas() {
  const [urls, setUrls] = useState([]);
  const [userData, setUserData] = useState({});
  const [viewOption, setViewOption] = useState('total');
  const [urlsClicks, setUrlsClicks] = useState([]);
  const [selectedUrlId, setSelectedUrlId] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState({});


  const navigate = useNavigate();

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    try {
      const userResponse = await axios.get('http://localhost:5000/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(userResponse.data);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        const errorMessage = err.response.data.error;
        alert(errorMessage);
        navigate('/Subscripción');
      }
      console.error('Error al intentar acceder a los datos del usuario:', err);
    }
  };

  const fetchUrls = async () => {
    const token = localStorage.getItem('token');
    try {
      const urlResponse = await axios.get('http://localhost:5000/user-urls', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUrls(Array.isArray(urlResponse.data) ? urlResponse.data : []);
      if (urlResponse.data.length > 0 && !selectedUrlId) {
        setSelectedUrlId(urlResponse.data[0].id);
        setSelectedUrl(urlResponse.data[0])
      }
      
      
    } catch (err) {
      console.error('Error al intentar obtener las URLs del usuario:', err);
    }
  };
  const fetchClickData = async () => {
    const token = localStorage.getItem('token');
    if (!selectedUrlId) return; // No hacer nada si no hay URL seleccionada

    try {
      let response;
      if (viewOption === 'total') {
        response = await axios.get('http://localhost:5000/clicks/total', {
          headers: { Authorization: `Bearer ${token}` },
          params: { url_id: selectedUrlId },
        });
      } else if (viewOption === 'day') {
        response = await axios.get('http://localhost:5000/clicks/daily', {
          headers: { Authorization: `Bearer ${token}` },
          params: { url_id: selectedUrlId },
        });
      } else if (viewOption === 'hour') {
        response = await axios.get('http://localhost:5000/clicks/hourly', {
          headers: { Authorization: `Bearer ${token}` },
          params: { url_id: selectedUrlId },
        });
      }
      setUrlsClicks(response ? response.data : []);
    } catch (err) {
      console.error('Error al intentar obtener los datos de clics:', err);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUrls();
  }, [fetchUrls,fetchUserData]);

  useEffect(() => {
    fetchClickData();
  }, [viewOption, selectedUrlId]);
  useEffect(() => {
    const url = urls.find((url) => url.id === selectedUrlId);
    setSelectedUrl(url || {});
  }, [selectedUrlId, urls]);

  return (
    <div className="mt-5 contenedor-estadisticas d-flex justify-content-center">
      <div className="row container">
        <Card className="mb-4 p-4 shadow-sm rounded-top-0">
          <Card.Body>
            <Card.Title className="text-center">Resumen General</Card.Title>
            <Row className="text-center mt-3">
              <Col xs={12} md={4}>
                <h5>URLs Acortadas</h5>
                <p>{urls.length}</p>
              </Col>
              <Col xs={12} md={4}>
                <h5>Clics Totales</h5>
                <p>{urls.reduce((total, item) => total + Number(item.click_count || 0), 0)}</p>
              </Col>
              <Col xs={12} md={4}>
                <h5>Usuario Desde</h5>
                <p>{new Date(userData.createdAt).toLocaleDateString()}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="mt-5 text-center shadow">
          <h3 className="mt-3">Estadísticas de URLs Acortadas</h3>
          {userData.createdAt && urls.length > 0 ? (
                     <TotalClicksChart/>

          ) : (
            <p>Cargando datos de URLs...</p>
          )}
        </Card>

        <Card className="mt-4 shadow mb-4">
          <div className="text-center mt-3">
            <h3>Estadísticas de Clics en URLs</h3>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>URL</Form.Label>
            <Form.Select
              value={selectedUrlId || ''}
              onChange={(e) => setSelectedUrlId(Number(e.target.value))}
              aria-label="Selecciona una URL corta"
            >
              <option value="" disabled>
                Selecciona una URL
              </option>
              {urls.map((url) => (
                <option key={url.id} value={url.id}>
                  {url.short_url}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group>
            <Form.Label>Ver clics:</Form.Label>
            <Form.Select
              value={viewOption || ''}
              onChange={(e) => setViewOption(e.target.value)}
              aria-label="Ingrese un rango de tiempo"
            >
              <option disabled value="">
                Selecciona un Rango de Tiempo
              </option>
              <option value="total">Total</option>
              <option value="day">Por Día</option>
              <option value="hour">Por Hora</option>
            </Form.Select>
          </Form.Group>

          {urlsClicks.length > 0 ? (
            <ClickChart urls={urlsClicks} viewOption={viewOption} url={selectedUrl} />
          ) : (
            <p>No hay Clicks Registrados</p>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Estadisticas;