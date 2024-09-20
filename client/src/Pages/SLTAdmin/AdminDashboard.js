import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For navigation
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement } from 'chart.js';
import MonthlyUserRegistrationsChart from '../../componants/MonthlyUserRegChart';
import UserRolesDistributionChart from '../../componants/UserRoleDistributionChart';
import DailyEventRegistrationsChart from '../../componants/DailyEventRegChart';
import '../../css/SLTAdmin/Dashboard.css';
import Navbar from '../../componants/SLTAdminNavbar';
import { FaCalendarDays } from "react-icons/fa6";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, ArcElement);

const AdminDashboard = () => {
  const [monthlyUserRegistrations, setMonthlyUserRegistrations] = useState([]);
  const [userRolesDistribution, setUserRolesDistribution] = useState([]);
  const [dailyEventRegistrations, setDailyEventRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // To handle navigation
  const [metrics, setMetrics] = useState({
    approvedCount: 0,
    pendingCount: 0,
    declinedCount: 0
  });

  // Fetch dashboard data (users, roles, events)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the backend
        const monthlyUserRegistrationsResponse = await axios.get('http://localhost:5000/api/monthly-user-registrations');
        const userRolesDistributionResponse = await axios.get('http://localhost:5000/api/user-roles-distribution');
        const dailyEventRegistrationsResponse = await axios.get('http://localhost:5000/api/daily-event-registrations');

        setMonthlyUserRegistrations(monthlyUserRegistrationsResponse.data);
        setUserRolesDistribution(userRolesDistributionResponse.data);
        setDailyEventRegistrations(dailyEventRegistrationsResponse.data);
      } catch (error) {
        setError('Error fetching dashboard data');
        console.error('Error fetching dashboard data:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Fetch event metrics (approved, pending, declined)
  useEffect(() => {
    fetch('http://localhost:5000/api/event-status-counts')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();  // Ensure the response is actually JSON
  })
  .then(data => {
    setMetrics({
      approvedCount: data.approvedCount,
      pendingCount: data.pendingCount,
      declinedCount: data.declinedCount
    });
  })
  .catch(error => {
    console.error('Error fetching metrics:', error);
  });

  }, []);


  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <Navbar />
      <div className="banner">
        <br></br>
        <br></br>
          <h1>Platform Activity</h1>  {/* Header section with title*/}
        </div>
      <div className="dashboard">
        <div className="metrics">
          <div className="card-a">
            <div className="card-content">
              <h2>{metrics.approvedCount}</h2>
              <div className="text-with-icon">
                <p>Approved Events</p>
                <FaCalendarDays className="icon" />
              </div>
            </div>
          </div>

          <div className="card-p">
            <div className="card-content">
              <h2>{metrics.pendingCount}</h2>
              <div className="text-with-icon">
                <p>Pending Events</p>
                <FaCalendarDays className="icon" />
              </div>
            </div>
          </div>

          <div className="card-d">
            <div className="card-content">
              <h2>{metrics.declinedCount}</h2>
              <div className="text-with-icon">
                <p>Declined Events</p>
                <FaCalendarDays className="icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts section */}
        <div className="charts">
          <div className="chart-column">
            <br></br>
            <DailyEventRegistrationsChart data={dailyEventRegistrations} />
          </div>
          <div className="chart-column">
            <UserRolesDistributionChart data={userRolesDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
