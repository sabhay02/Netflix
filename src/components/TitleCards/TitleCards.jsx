import React, { useRef, useEffect, useState } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, category }) => {
  const cardsRef = useRef();
  const [apiData,setApiData]=useState([])

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZmZkMTIzODE0ODU5MDQxOTM5MmUyZTJjMmU0MTA4NCIsIm5iZiI6MTc1MTI2OTMwMS4wODksInN1YiI6IjY4NjIzZmI1OGVhZDYxNDNhMjkxNWU2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WWmkkDXmW_ux9dNiRzpzyGxhPwj470F3NMXuMUGvWdc'
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const container = cardsRef.current;
    container.scrollLeft += event.deltaY;
    updateScrollButtons();
  };

  const scrollLeft = () => {
    const container = cardsRef.current;
    container.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    const container = cardsRef.current;
    container.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  };

  const updateScrollButtons = () => {
    const container = cardsRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const getGenreText = (category) => {
    const genreMap = {
      'top_rated': 'Top Rated',
      'popular': 'Netflix Original',
      'upcoming': 'Coming Soon',
      'now_playing': 'New Release'
    };
    return genreMap[category] || 'Featured';
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const getGenreText = (category) => {
    const genreMap = {
      'top_rated': 'Top Rated',
      'popular': 'Netflix Original',
      'upcoming': 'Coming Soon',
      'now_playing': 'New Release'
    };
    return genreMap[category] || 'Featured';
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  useEffect(() => {
    const endpoint = category ? category : "now_playing";
    setIsLoading(true);

fetch(`https://api.themoviedb.org/3/movie/${endpoint}?language=en-US&page=1`, options)
  .then(res => res.json())
  .then(res => {
    console.log("API Response:", res);
    setApiData(res.results || []);
  })
  .catch(err => console.error("API Error:", err));




    const ref = cardsRef.current;
    ref.addEventListener('wheel', handleWheel);
    return () => ref.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className='title-cards'>
      <h2>{title?title:"Popular on Netflix"}</h2>
      <div className='card-list' ref={cardsRef}>
        {isLoading ? (
          renderSkeletonCards()
        ) : (
          apiData.map((card, index) => (
            <Link to={`/player/${card.id}`} className='card' key={index}>
              <div className="card-image-container">
                <img 
                  src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`} 
                  alt={card.original_title}
                  loading="lazy"
                />
                <div className="card-overlay"></div>
                <div className="play-button"></div>
                <div className="card-badge">{getGenreText(category)}</div>
              </div>
              <div className="card-info">
                <div className="card-title">{card.original_title}</div>
                {card.vote_average > 0 && (
                  <div className="card-rating">
                    <span>⭐</span>
                    <span>{formatRating(card.vote_average)}</span>
                  </div>
                )}
                <div className="card-genre">
                  {card.release_date ? new Date(card.release_date).getFullYear() : 'TBA'}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default TitleCards;