import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

const UserRolesDistributionChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/user-roles-distribution');
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
        data: data.map(item => item.count),
        backgroundColor: ['rgba(54, 162, 235, 0.8)','rgba(54, 162, 235, 0.5)','rgba(54, 162, 235, 0.2)'],
        borderColor: ['rgba(54, 162, 235, 1)','rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 1)'],
      },
    ],
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return <Pie data={chartData} />;
};

export default UserRolesDistributionChart;
