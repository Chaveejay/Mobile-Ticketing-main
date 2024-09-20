const Ticket = require('../models/Ticket');
// const Event = require('../models/Event');
const EventRequest = require('../models/EventRequest')

exports.getDashboardMetrics = async (req, res) => {
  try {
    // Fetch total tickets sold and gross sales
    const totalTicketsSold = await Ticket.aggregate([
      { $group: { _id: null, totalQuantity: { $sum: '$quantity' }, totalSales: { $sum: '$totalPrice' } } }
    ]);

    const totalTickets = totalTicketsSold[0] || { totalQuantity: 0, totalSales: 0 };

    // Fetch total number of events
    const totalEvents = await EventRequest.countDocuments();

    res.status(200).json({
      totalTicketSold: totalTickets.totalQuantity,
      grossSales: totalTickets.totalSales,
      events: totalEvents
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error.message);
    res.status(500).send('Internal Server Error');
  }
};




exports.getMonthlyTicketsData = async (req, res) => {
  try {
    const monthlyTickets = await Ticket.aggregate([
      
      {
        $group: {
          _id: { $month: "$purchaseDate" }, 
          totalTickets: { $sum: "$quantity" }
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
                { case: { $eq: ["$_id", 12] }, then: "December" }
              ],
              default: "Unknown"
            }
          }
        }
      },
      // Optionally project the fields you want to keep
      { $project: { _id: 0, month: 1, totalTickets: 1 } }
    ]);

    res.status(200).json(monthlyTickets);
  } catch (error) {
    console.error("Error fetching monthly tickets data:", error.message);
    res.status(500).send("Internal Server Error");
  }
};

  
  exports.getDailyTicketsData = async (req, res) => {
    try {
      // Fetch daily ticket sales data
      const dailyTickets = await Ticket.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$purchaseDate" } // Make sure `purchaseDate` is the correct field
            },
            totalTickets: { $sum: "$quantity" } // Sum up the quantity of tickets purchased
          }
        },
        { $sort: { _id: 1 } } // Sort by date
      ]);
  
      res.status(200).json(dailyTickets);
    } catch (error) {
      console.error('Error fetching daily tickets data:', error.message);
      res.status(500).send('Internal Server Error');
    }
  };

  exports.getTicketStats = async (req, res) => {
    try {
      const soldTickets = await Ticket.aggregate([
        { $group: { _id: null, totalSold: { $sum: '$quantity' } } },
      ]);
  
      const availableTickets = await EventRequest.aggregate([
        { $unwind: '$ticketTypes' },
        { $group: { _id: null, totalAvailable: { $sum: '$ticketTypes.quantity' } } },
      ]);
  
      res.json({
        sold: soldTickets[0]?.totalSold || 0,
        available: availableTickets[0]?.totalAvailable || 0,
      });
    } catch (error) {
      console.error('Error fetching ticket stats:', error.message);
      res.status(500).send('Internal Server Error');
    }
  };