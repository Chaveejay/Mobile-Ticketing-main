import React, { useEffect, useState } from "react";
import "../../css/AllCategory.css";
import { useNavigate } from "react-router-dom";
import music from "../../images/categories/music.png";
import dance from "../../images/categories/dance.png";
import sport from "../../images/categories/sport.png";
import festival from "../../images/categories/festival.png";
import art from "../../images/categories/art.png";
import education from "../../images/categories/education.png";
import charity from "../../images/categories/charity.png";
import exhibition from "../../images/categories/exhibition.png";
import fitness from "../../images/categories/fitness.png";
import fashion from "../../images/categories/fashion.png";
import gaming from "../../images/categories/gaming.png";
import auto from "../../images/categories/auto.png";
import tech from "../../images/categories/tech.png";
import kids from "../../images/categories/kids.png";
import Navbar from "../../componants/usernavbar";

const AllCategory = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/categories");
      console.log('Response status:', response.status); // Log response status

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Data:', data); // Log the fetched data

      const categoryImages = {
        Music: music,
        Dance: dance,
        Sport: sport,
        Festival: festival,
        Art: art,
        Education: education,
        Charity: charity,
        Exhibition: exhibition,
        Fitness: fitness,
        Fashion: fashion,
        Gaming: gaming,
        Auto: auto,
        Tech: tech,
        Kids: kids,
      };

      const categoriesWithImages = data.map((category) => ({
        name: category,
        imgSrc: categoryImages[category] || "", // Ensure a default image or handle missing cases
      }));
      
      console.log('Processed Categories:', categoriesWithImages); // Log processed categories

      setCategories(categoriesWithImages);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/category/${categoryName.toLowerCase()}`);
  };

  return (
    <div className="app">
      <main className="main">
      <div>
            <Navbar/>
          </div>
        <div className="banner">
        <br></br>
        <br></br>
          <h1>Let's Book Your Ticket</h1>
          <p>Discover your favorite entertainment right here</p>
        </div>
        <div className="categories">
          <h2>Categories</h2>
          <div className="categories-grid">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.name}
                  className="category"
                  role="button"
                  tabIndex={0}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <img src={category.imgSrc} alt={category.name} />
                  <p>{category.name}</p>
                </div>
              ))
            ) : (
              <p>Loading categories...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllCategory;
