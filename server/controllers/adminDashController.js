const User = require('../models/User');
const EventRequest = require('../models/EventRequest');

exports.getMonthlyUserRegistrations = async (req, res) => {
  try {
    const monthlyRegistrations = await User.aggregate([
      {
        $group: {
          _id: { $month: "$registrationDate" }, 
          totalRegistrations: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      {
        $addFields: {
          month: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "January" },
                { case: { $eq: ["$_id", 2] }, then: "February" },
                { case: { $eq: ["$_id", 3] }, then: "March" },
                { case: { $eq: ["$_id", 4] }, then: "April" },
                { case: { $eq: ["$_id", 5] }, then: "May" },
                { case: { $eq: ["$_id", 6] }, then: "June" },
                { case: { $eq: ["$_id", 7] }, then: "July" },
                { case: { $eq: ["$_id", 8] }, then: "August" },
                { case: { $eq: ["$_id", 9] }, then: "September" },
                { case: { $eq: ["$_id", 10] }, then: "October" },
                { case: { $eq: ["$_id", 11] }, then: "November" },
                { case: { $eq: ["$_id", 12] }, then: "December" },
              ],
              default: "Unknown"
            }
          }
        }
      },
      { $project: { _id: 0, month: 1, totalRegistrations: 1 } }
    ]);

    res.status(200).json(monthlyRegistrations);
  } catch (error) {
    console.error('Error fetching monthly user registrations data:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

exports.getUserRolesDistribution = async (req, res) => {
  try {
    const rolesDistribution = await User.aggregate([
      {
        $group: {
          _id: "$role", 
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json(rolesDistribution);
  } catch (error) {
    console.error('Error fetching user roles distribution data:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

exports.getDailyEventRegistrations = async (req, res) => {
  try {
    const dailyRegistrations = await EventRequest.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$eventDate" }
          },
          totalEvents: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(dailyRegistrations);
  } catch (error) {
    console.error('Error fetching daily event registrations data:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

exports.getEventStatusCounts = async (req, res) => {
  try {
    const approvedCount = await EventRequest.countDocuments({ status: 'Approved' });
    const pendingCount = await EventRequest.countDocuments({ status: 'Pending' });
    const declinedCount = await EventRequest.countDocuments({ status: 'Declined' });

    res.status(200).json({ approvedCount, pendingCount, declinedCount });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving event status counts', error });
  }
};

