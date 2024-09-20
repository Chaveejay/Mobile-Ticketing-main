import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register the necessary elements
ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const MonthlyTicketsChart = () => {
  const [monthlyTicketsData, setMonthlyTicketsData] = useState([]);

  useEffect(() => {
    // Fetch monthly ticket sales data from the backend
    axios.get('http://localhost:5000/api/dashboard/monthly-tickets')
      .then(response => {
        setMonthlyTicketsData(response.data);
      })
      .catch(error => {
        console.error('Error fetching ticket data:', error);
      });
  }, []);

  const chartData = {
    labels: monthlyTicketsData.map(data => data.month), // Use month names
    datasets: [{
      label: 'Total Tickets Sold',
      data: monthlyTicketsData.map(data => data.totalTickets),
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
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
        text: 'Monthly Tickets Sold'
      }
    }
  };

  return (
    <div>
      <h5>Monthly Tickets Sold</h5>
      <Line data={chartData} options={chartOptions}/>
    </div>
  );
};

export default MonthlyTicketsChart;
