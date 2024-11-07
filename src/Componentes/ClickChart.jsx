import React, { useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';

function ClickChart({ urls, viewOption }) {
  const chartData = useMemo(() => {
    // Configuración de etiquetas y datos en función de la vista seleccionada
    let labels;
    let data;

    if (viewOption === 'total') {
      // Vista Total: Mostrar clics totales por cada URL acortada
      labels = urls.map((url) => url.short_url || 'Sin datos');
      data = urls.map((url) => url.total_clicks || 0);
    } else if (viewOption === 'day') {
      // Vista Diaria: Mostrar clics diarios por fecha
      labels = urls.map((url) => url.date || 'Sin datos');
      data = urls.map((url) => url.clicks || 0);
    } else if (viewOption === 'hour') {
      // Vista por Hora: Mostrar clics por hora específica
      labels = urls.map((url) => url.hour || 'Sin datos');
      data = urls.map((url) => url.clicks || 0);
    } else {
      // Caso por defecto si la vista no es reconocida
      labels = ['Sin datos'];
      data = [0];
    }

    return {
      labels,
      datasets: [
        {
          label: 'Clics en URLs Acortadas',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          fill: false, // Desactiva el relleno bajo la línea en el gráfico lineal
          tension: 0.6, // Suaviza la línea en el gráfico lineal
        },
      ],
    };
  }, [urls, viewOption]);

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
          text: viewOption === 'total' ? 'URL Acortada' : viewOption === 'day' ? 'Fecha' : 'Hora',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Clics: ${tooltipItem.parsed.y}`,
        },
      },
    },
  };

  // Renderizar el componente adecuado según `viewOption`
  return viewOption === 'total' ? (
    <Bar data={chartData} options={options} />
  ) : (
    <Line data={chartData} options={options} />
  );
}

export default ClickChart;