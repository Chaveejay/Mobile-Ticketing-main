import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const DailyEventRegistrationsChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/daily-event-registrations');
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
    labels: data.map(item => item._id),
    datasets: [
      {
        label: 'Daily Event Registrations',
        data: data.map(item => item.totalEvents),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
      },
    ],
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <Bar data={chartData} />;
};

export default DailyEventRegistrationsChart;
