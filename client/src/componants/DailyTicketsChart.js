import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the necessary elements
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const DailyTicketsChart = () => {
  const [dailyTicketsData, setDailyTicketsData] = useState([]);

  useEffect(() => {
    // Fetch daily tickets data from the backend
    axios.get('http://localhost:5000/api/dashboard/daily-tickets')
      .then(response => {
        setDailyTicketsData(response.data);
      })
      .catch(error => {
        console.error('Error fetching daily tickets data:', error);
      });
  }, []);

  const chartData = {
    labels: dailyTicketsData.map(data => data._id), // Dates
    datasets: [{
      label: 'Total Tickets Sold',
      data: dailyTicketsData.map(data => data.totalTickets),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Daily Tickets Sold'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Total Tickets'
        }
      }
    }
  };

  return (
    <div>
      <h5>Daily Tickets Sold</h5>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default DailyTicketsChart;
