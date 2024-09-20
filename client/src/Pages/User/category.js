import React, { useState, useEffect } from 'react';
import Navbar from '../../componants/usernavbar';
import '../../css/events.css';
import { FaSearch } from "react-icons/fa";
import EventCard from '../../componants/eventcard';
import SearchBar from '../../componants/searchbar'; // Ensure the path is correct
import axios from '../../utils/axios'; // Use your custom axios instance
import { useParams } from 'react-router-dom'; // Import useParams to get URL params

const Category = () => {
  const { category } = useParams(); // Get the category from the URL
  const [searchQuery, setSearchQuery] = useState(''); // State to store the search query
  const [events, setEvents] = useState([]); // State to store the search results
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(''); // State for error messages

  useEffect(() => {
    const fetchEventsByCategory = async () => {
      try {
        const response = await axios.get(`/category/${category}`); // Fetch events by category
        console.log(`Fetched events for ${category}:`, response.data);
        setEvents(response.data);
        setLoading(false); // Set loading to false after fetching
      } catch (err) {
        console.error(`Error fetching events for ${category}:`, err);
        setError('Failed to fetch events. Please try again later.');
        setLoading(false); // Set loading to false even if there is an error
      }
    };

    fetchEventsByCategory();
  }, [category]);

  // Function to capitalize the first letter of the category name
  const capitalizeCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  // Function to handle search input changes
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value); // Update the search query state
  };

  // Function to handle search submission
  const handleSearchSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    setLoading(true); // Set loading to true when searching
    try {
      if (searchQuery) {
        // Send a GET request to the backend with the search query
        const response = await axios.get('/search', { params: { query: searchQuery } });
        setEvents(response.data); // Update the events state with the search results
      } else {
        // If the search query is empty, fetch events by the category again
        const response = await axios.get(`/category/${category}`);
        setEvents(response.data);
      }
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error searching events:', err.message);
      setError('Error searching events. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after searching
    }
  };

  return (
    <div>
      <Navbar />

      <div className="events-banner">
        <h1>{capitalizeCategoryName(category)} Events</h1> {/* Capitalize category name */}
        <div className="details">
          <div className='details-description'>
            Discover your favorite {capitalizeCategoryName(category)} events right here
          </div>
        </div>
        <div className='search'>
          <SearchBar
            searchQuery={searchQuery}
            onSearchInputChange={handleSearchInputChange}
            onSearchSubmit={handleSearchSubmit}
          />
          <FaSearch className='sicon' />
        </div>
      </div>

      <div className='events-section'>
        <h4>{capitalizeCategoryName(category)} Events</h4> {/* Capitalize category name */}
        {loading ? (
          <p>Loading events...</p> // Display loading indicator
        ) : error ? (
          <p className="text-red-500">{error}</p> // Display error message if any
        ) : events.length === 0 ? (
          <p>No events found for {capitalizeCategoryName(category)}</p>
        ) : (
          <div className='event-container'>
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Category;
