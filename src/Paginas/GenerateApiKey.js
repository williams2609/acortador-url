import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GenerateApiKey = () => {
  const [apiKeys, setApiKeys] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');

  const fetchApiKeys = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:5000/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApiKeys(response.data.api_token || null);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cargar la API Key');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        'http://localhost:5000/generate-api-key',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApiKeys(response.data.api_key);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al generar la API Key');
    } finally {
      setLoading(false);
    }
  };

  const deleteApiKey = async (key) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`http://localhost:5000/api-keys/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApiKeys(null)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al eliminar la API Key');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Gestión de API Keys</h1>
      <p className="text-center">
        Aquí puedes ver, generar o eliminar tus API Keys. Asegúrate de mantenerlas seguras y no compartirlas con terceros.
      </p>

      <div className="text-center mb-4">
        <button
          className="btn btn-primary btn-lg"
          onClick={generateApiKey}
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Generar Nueva API Key'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="card shadow">
        <div className="card-header">
          <h3>Mis API Keys</h3>
        </div>
        <div className="card-body table-responsive">
          {loading ? (
            <p>Cargando...</p>
          ) : apiKeys !== null ? (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>API Key</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ wordBreak: 'break-word' }}>{apiKeys}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteApiKey(apiKeys.api_token)}
                      disabled={loading}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-center">No tienes API Keys generadas actualmente.</p>
          )}
        </div>
      </div>

      <div className="alert alert-info mt-5">
        <strong>Nota:</strong> Puedes renovar una API Key eliminándola y generando una nueva.
      </div>
    </div>
  );
};

export default GenerateApiKey;