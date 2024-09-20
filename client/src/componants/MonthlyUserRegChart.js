import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const MonthlyUserRegistrationsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/monthly-user-registrations');
        setData(response.data);
      } catch (err) {
        setError('Error fetching data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Monthly User Registrations',
        data: data.map(item => item.totalRegistrations),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <Line data={chartData} />;
};

export default MonthlyUserRegistrationsChart;
