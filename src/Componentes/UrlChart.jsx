import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';

function UrlChart({ urls, createdAt }) {
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

  const chartData = useMemo(() => {
    const { labels, data } = prepareChartData(urls, createdAt);
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
  }, [urls, createdAt]);

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
  };

  return <Line data={chartData} options={options} />;
}

export default UrlChart;