import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import MonthlyTicketsChart from '../../componants/MonthlySalesChart';
import DailyTicketsChart from '../../componants/DailyTicketsChart';
import TicketStatsChart from '../../componants/TicketStatsChart';
import '../../css/Organizer/Dashboard.css';
import { IoTicket } from "react-icons/io5";
import { GiReceiveMoney } from "react-icons/gi";
import { FaCalendarDays } from "react-icons/fa6";
import Navbar from '../../componants/organizernavbar';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [monthlySales, setMonthlySales] = useState([]);
  const [ticketStats, setTicketStats] = useState({ sold: 0, available: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // To handle navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check user role before making requests
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/unauthorized'); // Redirect if no token found
          return;
        }

        const { data: userData } = await axios.get('http://localhost:5000/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userData.role !== 'Organizer') {
          navigate('/unauthorized'); // Redirect if not an Organizer
          return;
        }

        // Proceed with data fetching if role is correct
        const metricsResponse = await axios.get('http://localhost:5000/api/dashboard/metrics', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const monthlySalesResponse = await axios.get('http://localhost:5000/api/dashboard/monthly-tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ticketStatsResponse = await axios.get('http://localhost:5000/api/dashboard/ticket-stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMetrics(metricsResponse.data);
        setMonthlySales(monthlySalesResponse.data);
        setTicketStats(ticketStatsResponse.data);
      } catch (error) {
        setError('Error fetching dashboard data');
        console.error('Error fetching dashboard data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="banner">
        <br></br>
        <br></br>
          <h1>Dashboard</h1>  {/* Header section with title*/}
        </div>
      <div className="dashboard-organizer">
        {/* Header section with title and search bar */}
        <div className="dashboard-organizer-header">
          <h1>Event Organizer Dashboard</h1>
        </div>

        {/* Metrics section */}
        <div className="metrics-organizer">
          <div className="card-organizer">
            <div className="card-organizer-content">
              <h2>{metrics.totalTicketSold}</h2>
              <div className="text-with-icon">
                <p>Total Tickets Sold</p>
                <IoTicket className="icon" />
              </div>
            </div>
          </div>

          <div className="card-organizer">
            <div className="card-organizer-content">
              <h2>LKR {metrics.grossSales}</h2>
              <div className="text-with-icon">
                <p>Gross Sales</p>
                <GiReceiveMoney className="icon" />
              </div>
            </div>
          </div>

          <div className="card-organizer">
            <div className="card-organizer-content">
              <h2>{metrics.events}</h2>
              <div className="text-with-icon">
                <p>Total Events</p>
                <FaCalendarDays className="icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts section */}
        <div className="charts">
          <div className="chart-column">
            <MonthlyTicketsChart />
            <DailyTicketsChart />
          </div>
          <div className="chart-column">
            <TicketStatsChart sold={ticketStats.sold} available={ticketStats.available} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
