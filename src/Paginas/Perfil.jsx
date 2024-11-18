import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './Estilos/userPerfil.css';
import { useAuth } from '../Componentes/AuthProvider';
import { useNavigate } from 'react-router-dom';

Chart.register(...registerables);

function Perfil() {
  const urlRefs = useRef({});
  const [userData, setUserData] = useState(null);
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState(null);
  const [urlStats, setUrlStats] = useState({});
  const [editVisible, setEditVisible] = useState(null);
  const { logout } = useAuth();
  const [editMode, setEditMode] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ qrCode,setQrCode ] = useState(false);
  const [ qrData, setQrData ] = useState({});
 const [responseApiKey, setResponseApiKey] = useState('')
  // Función para manejar la eliminación de URL
  
  const token = localStorage.getItem('token')
  
  const fetchData = async () => {
   
    if (token) {
      setLoading(true);
      setError(null); // Limpiar el error anterior en una nueva búsqueda
    
      try {
        const [userResponse, urlsResponse] = await Promise.all([
          axios.get('http://localhost:5000/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/user-urls', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUserData(userResponse.data);
        setUrls(urlsResponse.data);
        console.log(urlsResponse.data)
        
      } catch (err) {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response ? err.response.data : 'Error de conexión');
        }
      } finally {
        setLoading(false);
      }
    }
  };
  const handleGenerateQr= async (urlId, shortUrl)=> {
    try{
      const qrModifyResponse = await axios.put(`http://localhost:5000/generateQr/${shortUrl}`,{},{
        headers: {Authorization:`Bearer ${token}` },
      });

      if (qrModifyResponse.data.qr_code) {
        setQrData((prevQrData)=>({
          ...prevQrData,[urlId]: qrModifyResponse.data.qr_code,
        }));
      }
      console.log(qrData)
      console.log(qrCode)
  }catch(err){
    console.error('error al intentar ingresan en /generateQr',err)
    if(err.status === 403){
      setError('Necesitas Una SUBSCRIPCIÓN para poder Generar QR')
    }
  }
   }

   const handleGenerateApiKey = async ()=>{
    try{
      const response = await axios.post('http://localhost:5000/generate-api-key',{},{
        headers:{Authorization:`Bearer ${token}`}
      })
      setResponseApiKey(response.data.api_token);
      setUserData((prevData)=>({
        ...prevData,
        api_token: response.data.api_token
      }));
    } catch (err) {
      // Manejo de errores
      console.error('Error al intentar generar la API Key:', err);
      const errorMsg =
        err.response?.data?.error || 'Error al generar la API Key. Intenta nuevamente.';
      setError(errorMsg);
    }
   }
  // Función para recuperar datos de usuario y URLs
  useEffect(() => {
    fetchData();
  }, [navigate,qrData]);
  console.log(userData)
  
  const handleDelete = async (shortUrl) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`http://localhost:5000/eliminar/${shortUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUrls((prevUrls) => prevUrls.filter((url) => url.short_url !== shortUrl));
  
    } catch (err) {
      console.error('Error al intentar acceder a la ruta delete:', err.response ? err.response.data : err);
      if(err.status === 403){
      setError('Necesitas una SUBSCRIPCION para eliminar una URL');
      }
      else {
        setError('Error al eliminar la URL');
      }
    }
  };

  useEffect(() => {
    setUrlStats({ totalUrls: urls.length });
  }, [urls]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const prepareChartData = (urls, createdAt) => {
    const dateCounts = {};
    const startDate = new Date(createdAt);
    const endDate = new Date();
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const date = currentDate.toLocaleDateString();
      dateCounts[date] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    urls.forEach((url) => {
      const created_at = new Date(url.createdAt);
      if (!isNaN(created_at)) {
        const date = created_at.toLocaleDateString();
        if (dateCounts[date] !== undefined) {
          dateCounts[date] += 1;
        }
      }
    });

    const labels = Object.keys(dateCounts);
    const data = Object.values(dateCounts);
    return { labels, data };
  };

  const toggleEdit = (id) => {
    setEditVisible((prevId) => (prevId === id ? null : id));
  };

  const handleEditClick = (urlId) => {
    setEditMode(urlId);
  };
  

  const handleEditSave = async (urlId, newShortUrl, url) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
         await axios.put(
          `http://localhost:5000/modificar/${url}`,
          { new_short_url: newShortUrl},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setUrls((prevUrls) =>
          prevUrls.map((url) =>
            url.id === urlId ? { ...url, short_url: newShortUrl } : url // Actualiza solo el short_url
          )
        );
        setEditMode(null);
      } catch (err) {
        console.error('Error interno en Edit URL:', err);
        setError('Error al editar la URL');
      }
    }
  };

  const chartData = useMemo(() => {
    const { labels, data } = userData
      ? prepareChartData(urls, userData.createdAt)
      : { labels: [], data: [] };

    return {
      labels: labels.length > 0 ? labels : ['Sin datos'],
      datasets: [
        {
          label: 'URLs Acortadas por Fecha',
          data: data.length > 0 ? data : [0],
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.4,
        },
      ],
    };
  }, [urls, userData]);

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad de URLs',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Fecha',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Cantidad: ${tooltipItem.parsed.y}`,
        },
      },
    },
  };

  const formatUrl = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  if (loading) {
    return <p>Cargando...</p>; // Mensaje de carga
  }

  return (
    <div className="perfil-container mt-5">
      <div className="sidebar mt-2">
        <h2>{userData?.username}</h2>
        <p>Miembro desde: {userData?.createdAt.split('T')[0]}</p>
        <p>Tipo de Subscripción: {userData?.subscriptionType} </p>
        <p>Total de URLs Acortadas: {urlStats.totalUrls}</p>
        <a onClick={handleLogout} className="cerrar-sesion" aria-label="Cerrar sesión">
          Cerrar Sesión <i className="ms-2 bi bi-box-arrow-right"></i>
        </a>
      </div>

      <div className="perfil-main">
        {error && <p className="error">{error.message || JSON.stringify(error)}</p>}

        <header className="header mt-2">
          {userData && <h2 className="welcome-msg">Bienvenido, {userData.username}</h2>}
        </header>

        <section className="urls-list flex-wrap">
          <h3>Mis URLs Acortadas</h3>
          <ul>
            {urls.map((url) => (
              <li key={url.id} className="url-item">
                <a
                  href={formatUrl(url.original_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="url-link"
                  aria-label={`Abrir URL original: ${url.original_url}`}
                >
                  {url.original_url}
                </a>
            <div>
              {error && <p className='invalid-feedback'>Necesitas una Subscripcion para Generar Qr</p>}
            {url.qr_code && (
    <img src={url.qr_code} alt="Código QR" className="qr-code-img" />
  )}
            </div>

                <div>
      {/* Muestra la URL base como texto sin editar */}
     
      <span className="base-url">http://localhost:5000/</span>
      {/* Solo permite editar la parte final (short_url) */}
      <span
        className={`short-url-editable base-url${editMode === url.id ? 'highlight' : ''}`}
        contentEditable={editMode === url.id}
        suppressContentEditableWarning={editMode === url.id}
        ref={(el) => (urlRefs.current[url.id] = el)} // Referencia a la parte editable
        aria-label={`Editar URL corta: ${url.short_url}`}
      >
        {url.short_url}
      </span>
                  {editMode === url.id && ( // Solo mostrar botón si está en modo de edición
                    <button
                      onClick={() => {
                        const newShortUrl = urlRefs.current[url.id]?.innerText.trim();
                        const shortUrlCode = newShortUrl.replace('http://localhost:5000/', '');
                        if (shortUrlCode && shortUrlCode !== url.short_url) {
                          handleEditSave(url.id, shortUrlCode, url.short_url);
                        }
                      }}
                      className="btn btn-primary ms-2 boton-guardar"
                      aria-label="Guardar cambios"
                    >
                      Guardar
                    </button>
                  )}
                  <i
                    className="bi bi-three-dots-vertical ms-3"
                    onClick={() => toggleEdit(url.id)}
                    style={{ cursor: 'pointer' }}
                    aria-label="Opciones de edición"
                  ></i>
                  {editVisible === url.id && (
                   <div className='d-flex align-items-center justify-content-end'>
                   <div className="edit-url">
                      <div>
                        <span onClick={() => handleDelete(url.short_url)} aria-label="Eliminar URL">Eliminar</span>
                        <i className="bi bi-trash ms-2"></i>
                      </div>
                      <div>
                        <span onClick={() => { handleEditClick(url.id); toggleEdit(url.id); }} aria-label="Editar URL">
                          Editar
                        </span>
                        <i className="bi bi-pencil-square ms-2"></i>
                      </div>
                      <div>
                        <span onClick={()=>{handleGenerateQr(url.id,url.short_url)}} className="me-2">Generar Qr</span>
                      <i className="fas fa-qrcode"></i>
                      </div>
                    </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="grafico">
          <h3>Estadísticas de URLs Acortadas</h3>
          <Line data={chartData} options={options} />
        </section>
        <section className='generate-api-key p-4'>
         <div className='d-flex p-5'>
           <div className="api-key-wrapper col-12 col-md-6 ">
              <strong className="mb-5">apiKey</strong>
              <pre className="api-key-block">
                <code>{responseApiKey || userData.api_token}</code>
              </pre>
            </div>
         </div>
        </section>
      </div>
      
    </div>
  );
}

export default Perfil;