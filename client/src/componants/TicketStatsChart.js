import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';

const TicketStatsChart = () => {
  const [ticketData, setTicketData] = useState({ sold: 0, available: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicketStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/ticket-stats');
        setTicketData(response.data);
      } catch (error) {
        setError('Error fetching ticket statistics');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketStats();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Calculate percentages
  const totalTickets = ticketData.sold + ticketData.available;
  const soldPercentage = ((ticketData.sold / totalTickets) * 100).toFixed(2);
  const availablePercentage = ((ticketData.available / totalTickets) * 100).toFixed(2);

  // Chart Data
  const data = {
    labels: ['Sold Tickets', 'Available Tickets'],
    datasets: [
      {
        label: 'Ticket Distribution',
        data: [ticketData.sold, ticketData.available],
        backgroundColor: ['#FF6384', '#36A2EB'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: '250px' }}> {/* Adjusted width and max-width */}
        <Pie data={data} />
      </div>
      <div>
        <h5>Ticket Percentages</h5>
        <p>Sold Tickets: {soldPercentage}%</p>
        <p>Available Tickets: {availablePercentage}%</p>
      </div>
    </div>
  );
};

export default TicketStatsChart;
