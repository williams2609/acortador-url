import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';

function ClickChart({ urls }) {
  const chartData = useMemo(() => {
    const labels = urls.map((url) => url.short_url); // Etiquetas para el gráfico (código de la URL acortada)
    const data = urls.map((url) => url.click_count || 0); // Conteo de clics para cada URL

    return {
      labels: labels.length > 0 ? labels : ['Sin datos'],
      datasets: [
        {
          label: 'Clics en URLs Acortadas',
          data: data.length > 0 ? data : [0],
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [urls]);

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
          text: 'URL Acortada',
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

  return <Bar data={chartData} options={options} />;
}

export default ClickChart;