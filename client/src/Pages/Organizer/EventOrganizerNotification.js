// import React, { useState, useEffect } from "react";
// import '../../css/Organizer/EventOrganizerNotification.css';
// import Navbar from '../../componants/organizernavbar.js'


// const EventNotifications = () => {
//     const initialNotifications = {
//       approved: [
//         { event: "Sakura Events", message: "The Sakura Event ticket verifier has approved the request.", read: false },
//         { event: "Surith Events", message: "The Surith Event ticket verifier has approved the request.", read: false },
//         { event: "Gold Events", message: "The Gold Event ticket verifier has approved the request.", read: false },
//         { event: "Marine Events", message: "The Marine Event ticket verifier has approved the request.", read: false }
//       ],
//       pending: [
//         // Pending notifications here
//       ],
//       declined: [
//         // declined notifications here
//       ]
//     };
  
//     const [notifications, setNotifications] = useState(initialNotifications);
//     const [activeTab, setActiveTab] = useState('all');
//     const [allNotifications, setAllNotifications] = useState([]);
  
//     useEffect(() => {
//       setAllNotifications([...notifications.approved, ...notifications.pending, ...notifications.declined]);
//     }, [notifications]);
  
//     const toggleRead = (category, index) => {
//       if (category === 'all') {
//         allNotifications[index].read = true;
//         setAllNotifications([...allNotifications]);
//         // Optionally, synchronize changes to main categories if needed
//       } else {
//         const newNotifications = { ...notifications };
//         newNotifications[category][index].read = true;
//         setNotifications(newNotifications);
//       }
//     };
  
//     const markAllAsRead = (category) => {
//       const newNotifications = { ...notifications };
  
//       if (category === 'all') {
//         Object.keys(newNotifications).forEach(key => {
//           newNotifications[key] = newNotifications[key].map(notification => ({ ...notification, read: true }));
//         });
//       } else {
//         newNotifications[category].forEach(notification => notification.read = true);
//       }
  
//       setNotifications(newNotifications);
//     };
  
//     return (
//         <div><Navbar/>

//       <div className="event-notification-container">
//         <div className="notification-sidebar">
//           <div className={`notification-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Notifications</div>
//           <div className={`notification-tab ${activeTab === 'approved' ? 'active' : ''}`} onClick={() => setActiveTab('approved')}>Approved</div>
//           <div className={`notification-tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending</div>
//           <div className={`notification-tab ${activeTab === 'declined' ? 'active' : ''}`} onClick={() => setActiveTab('declined')}>declined</div>
//         </div>
//         <div className="notification-content">
//           <div className="notification-header">
//             <h5><b>Notifications</b></h5>
//             <button className="mark-read-btn" onClick={() => markAllAsRead(activeTab)}>Mark All as Read</button>
//           </div>
//           {(activeTab === 'all' ? allNotifications : notifications[activeTab])?.map((notification, index) => (
//             <div key={index} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
//               <div className="notification-details">
//                 <h8><b>{notification.event}</b></h8>
//                 <p>{notification.message}</p>
//               </div>
//               <input type="checkbox" checked={notification.read} onChange={() => toggleRead(activeTab, index)} disabled={notification.read} />
//             </div>
//           ))}
//         </div>
//       </div>
//       </div>
//     );
//   };
  
//   export default EventNotifications;



import React, { useState, useEffect } from "react";
import axios from 'axios';
import '../../css/Organizer/EventOrganizerNotification.css';
import Navbar from '../../componants/organizernavbar.js';

const EventNotifications = () => {
    const [notifications, setNotifications] = useState({ approved: [], pending: [], declined: [] });
    const [activeTab, setActiveTab] = useState('all');
    const [allNotifications, setAllNotifications] = useState([]);

    useEffect(() => {
      const fetchNotifications = async () => {
          try {
              const token = localStorage.getItem('token');
              if (!token) throw new Error('No token found, please log in.');
  
              const response = await axios.get(`http://localhost:5000/api/notifications`, {
                  headers: { Authorization: `Bearer ${token}` },
              });
  
              const notifications = response.data;
              setNotifications({
                  approved: notifications.filter(notification => notification.status === 'Approved'),
                  pending: notifications.filter(notification => notification.status === 'Pending'),
                  declined: notifications.filter(notification => notification.status === 'Declined')
              });
          } catch (error) {
              console.error('Error fetching notifications:', error);
          }
      };
  
      fetchNotifications();
  }, []);
  

    useEffect(() => {
        setAllNotifications([...notifications.approved, ...notifications.pending, ...notifications.declined]);
    }, [notifications]);

    const toggleRead = (category, index) => {
        if (category === 'all') {
            allNotifications[index].read = true;
            setAllNotifications([...allNotifications]);
        } else {
            const newNotifications = { ...notifications };
            newNotifications[category][index].read = true;
            setNotifications(newNotifications);
        }
    };

    const markAllAsRead = (category) => {
        const newNotifications = { ...notifications };

        if (category === 'all') {
            Object.keys(newNotifications).forEach(key => {
                newNotifications[key] = newNotifications[key].map(notification => ({ ...notification, read: true }));
            });
        } else {
            newNotifications[category].forEach(notification => notification.read = true);
        }

        setNotifications(newNotifications);
    };

    const handleStatusChange = async (notificationId, status) => {
      try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No token found, please log in.');
  
          await axios.patch(`http://localhost:5000/api/notifications/${notificationId}/status`, { status }, {
              headers: { Authorization: `Bearer ${token}` },
          });
  
          // Optionally, refetch notifications or update state
      } catch (error) {
          console.error('Error updating notification status:', error);
      }
  };
  
    return (
        <div><Navbar/>

        <div className="event-notification-container">
            <div className="notification-sidebar">
                <div className={`notification-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>All Notifications</div>
                <div className={`notification-tab ${activeTab === 'approved' ? 'active' : ''}`} onClick={() => setActiveTab('approved')}>Approved</div>
                <div className={`notification-tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>Pending</div>
                <div className={`notification-tab ${activeTab === 'declined' ? 'active' : ''}`} onClick={() => setActiveTab('declined')}>Declined</div>
            </div>
            <div className="notification-content">
                <div className="notification-header">
                    <h5><b>Notifications</b></h5>
                    <button className="mark-read-btn" onClick={() => markAllAsRead(activeTab)}>Mark All as Read</button>
                </div>
                {(activeTab === 'all' ? allNotifications : notifications[activeTab])?.map((notification, index) => (
                    <div key={index} className={`notification-item ${notification.read ? 'read' : 'unread'}`}>
                        <div className="notification-details">
                            <h6><b>{notification.eventTitle}</b></h6>
                            <p>{notification.message}</p>
                        </div>
                        <input type="checkbox" checked={notification.read} onChange={() => toggleRead(activeTab, index)} disabled={notification.read} />
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default EventNotifications;
