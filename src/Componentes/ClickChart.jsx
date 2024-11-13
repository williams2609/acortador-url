import React, { useMemo } from 'react';
import { Bar, Line } from 'react-chartjs-2';

function ClickChart({ urls = [], viewOption, url }) {
  const chartData = useMemo(() => {
    let labels = [];
    let data = [];

    if (viewOption === 'total') {
      // Genera etiquetas de mes desde la fecha de creación hasta completar un año
      const creationDate = new Date(url?.createdAt || new Date());
      const months = {};
    
      // Genera hasta 12 meses consecutivos desde la fecha de creación
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(creationDate);
        monthDate.setMonth(creationDate.getMonth() + i); // Incrementa el mes desde la fecha de creación
    
        const monthStr = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
        months[monthStr] = 0; // Inicializa en 0 clics por defecto
      }
    
      // Combina los datos de clics con los meses generados
      urls.forEach((item) => {
        if (item.click_time) {
          const monthStr = item.click_time.slice(0, 7); // Formato 'YYYY-MM'
          if (months[monthStr] !== undefined) {
            months[monthStr] += item.clicks || 0;
          }
        }
      });
    
      labels = Object.keys(months);
      data = Object.values(months);
    }  else if (viewOption === 'day') {
      // Genera todas las fechas del último mes
      const today = new Date();
      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const daysInMonth = {};
      for (let d = new Date(lastMonth); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
        daysInMonth[dateStr] = 0; // Asigna 0 clics por defecto
      }

      // Combina los datos recibidos con las fechas generadas
      urls.forEach((item) => {
        if (item.date) {
          daysInMonth[item.date] = item.clicks || 0;
        }
      });

      labels = Object.keys(daysInMonth);
      data = Object.values(daysInMonth);

    } else if (viewOption === 'hour') {
      const currentHour = new Date();
      const last24Hours = new Date(currentHour);
      last24Hours.setHours(last24Hours.getHours() - 23);
  
      const hoursInDay = {};

      for (let h = new Date(last24Hours); h <= currentHour; h.setHours(h.getHours() + 1)) {
          const hourStr = h.toISOString().slice(0, 13) + ':00:00';
          hoursInDay[hourStr] = 0; // Inicializa en 0 por defecto
          
      }
      
      // Verificación adicional
  
      urls.forEach((item) => {
          if (item.hour) {
            const itemHourFormatted = new Date(item.hour).toISOString().slice(0, 14) + '00:00';
              const hourStr = item.hour;
              
              if (hoursInDay[itemHourFormatted] !== undefined) {
                  hoursInDay[hourStr] = item.clicks;
                  
              }
          }
      });
  
      labels = Object.keys(hoursInDay);
      data = Object.values(hoursInDay);
  
      // Verificación final
  }else {
      labels = ['Sin datos'];
      data = [0];
    }

    return {
      labels,
      datasets: [
        {
          label:
            viewOption === 'total'
              ? 'Total de Clics por Mes desde Creación'
              : 'Clics en URLs Acortadas',
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          fill: false,
          tension: 0.4,
        },
      ],
    };
  }, [urls, viewOption, url]);

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
          text: viewOption === 'day' ? 'Fecha' : viewOption === 'hour' ? 'Hora' : 'Mes',
        },
      },
    },
  };

  
  return viewOption === 'total'?( 
  <Bar data={chartData} options={options} />):(<Line data={chartData} options={options} />);

}

export default ClickChart;