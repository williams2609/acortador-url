import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

function TotalClicksChart() {
  const [urlData, setUrlData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        // Llama a la API para obtener todas las URLs con su total de clics
        const response = await axios.get('http://localhost:5000/urls-clicks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const sortedData = response.data.sort((a, b) => b.total_clicks - a.total_clicks);
        setUrlData(sortedData);
      } catch (err) {
        console.error('Error al obtener datos de URLs y clics:', err);
      }
    };

    fetchData();
  }, []);

  // Configuración del gráfico de barras
  const chartData = {
    labels: urlData.map((url) => url.short_url), // Nombres de las URLs en el eje X
    datasets: [
      {
        label: 'Total de Clics',
        data: urlData.map((url) => url.total_clicks), // Total de clics en el eje Y
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de Clics',
        },
      },
      x: {
        title: {
          display: true,
          text: 'URLs Acortadas',
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div>
      <h3 className="text-center">Total de Clics por URL</h3>
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default TotalClicksChart;