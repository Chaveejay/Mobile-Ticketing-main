import React from 'react';
import { IoSearchSharp } from 'react-icons/io5'; // Import the search icon

const SearchBar = ({ searchQuery, onSearchInputChange, onSearchSubmit }) => {
  return (
    <div className="relative" style={{ width: '600px' }}>
      <form onSubmit={onSearchSubmit} className="flex items-center">
        <input
          type="text"
          className="pl-10 pr-4 py-2 w-full shadow-md outline-none text-blue-800"
          value={searchQuery} // Set the input value to the search query state
          onChange={onSearchInputChange} // Handle input changes
          placeholder="Search for events..." // Placeholder text
        />

      </form>
    </div>
  );
};

export default SearchBar;
