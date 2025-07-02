import React, { useRef, useEffect, useState } from 'react';
import './TitleCards.css';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, category }) => {
  const cardsRef = useRef();
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
    setTimeout(updateScrollButtons, 300);
  };

  const scrollRight = () => {
    const container = cardsRef.current;
    container.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
    setTimeout(updateScrollButtons, 300);
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

  const getRandomProgress = () => {
    return Math.floor(Math.random() * 100);
  };

  useEffect(() => {
    const endpoint = category ? category : "now_playing";
    setIsLoading(true);
    setError(null);

    fetch(`https://api.themoviedb.org/3/movie/${endpoint}?language=en-US&page=1`, options)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch movies');
        }
        return res.json();
      })
      .then(res => {
        setApiData(res.results || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("API Error:", err);
        setError(err.message);
        setIsLoading(false);
      });
  }, [category]);

  useEffect(() => {
    const ref = cardsRef.current;
    if (ref) {
      ref.addEventListener('wheel', handleWheel);
      ref.addEventListener('scroll', updateScrollButtons);
      
      // Initial scroll button state
      updateScrollButtons();
      
      return () => {
        ref.removeEventListener('wheel', handleWheel);
        ref.removeEventListener('scroll', updateScrollButtons);
      };
    }
  }, [apiData]);

  const renderSkeletonCards = () => {
    return Array(8).fill(0).map((_, index) => (
      <div key={index} className="card">
        <div className="card-skeleton"></div>
        <div className="card-skeleton-info">
          <div className="skeleton-title"></div>
          <div className="skeleton-meta"></div>
        </div>
      </div>
    ));
  };

  const renderErrorCard = () => (
    <div className="error-card">
      <div className="error-icon">⚠️</div>
      <div className="error-text">Failed to load movies</div>
    </div>
  );

  if (error) {
    return (
      <div className='title-cards'>
        <h2>{title ? title : "Popular on Netflix"}</h2>
        <div className='card-list'>
          {renderErrorCard()}
        </div>
      </div>
    );
  }

  return (
    <div className='title-cards'>
      <h2>{title ? title : "Popular on Netflix"}</h2>
      <div className="cards-container">
        <button 
          className="scroll-button scroll-left"
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          ‹
        </button>
        
        <div className='card-list' ref={cardsRef}>
          {isLoading ? (
            renderSkeletonCards()
          ) : (
            apiData.map((card, index) => (
              <Link 
                to={`/player/${card.id}`} 
                className='card' 
                key={card.id || index}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
              >
                <div className="card-image-container">
                  <img 
                    src={
                      card.backdrop_path 
                        ? `https://image.tmdb.org/t/p/w500${card.backdrop_path}`
                        : card.poster_path
                        ? `https://image.tmdb.org/t/p/w500${card.poster_path}`
                        : 'https://via.placeholder.com/280x160?text=No+Image'
                    }
                    alt={card.original_title || card.title}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/280x160?text=No+Image';
                    }}
                  />
                  <div className="card-overlay"></div>
                  <div className="play-button" aria-label="Play movie"></div>
                  <div className="card-badge">{getGenreText(category)}</div>
                </div>
                <div className="card-info">
                  <div className="card-title">{card.original_title || card.title}</div>
                  <div className="card-meta">
                    {card.vote_average > 0 && (
                      <div className="card-rating">
                        <span>⭐</span>
                        <span>{formatRating(card.vote_average)}</span>
                      </div>
                    )}
                    <div className="card-year">
                      {card.release_date ? new Date(card.release_date).getFullYear() : 'TBA'}
                    </div>
                  </div>
                  <div className="card-genre">
                    {card.genre_ids && card.genre_ids.length > 0 ? 'Action • Drama' : 'Movie'}
                  </div>
                  {/* Simulated progress bar for "Continue Watching" effect */}
                  {category === 'now_playing' && Math.random() > 0.7 && (
                    <div className="card-progress">
                      <div 
                        className="card-progress-bar" 
                        style={{ width: `${getRandomProgress()}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </Link>
            ))
          )}
        </div>
        
        <button 
          className="scroll-button scroll-right"
          onClick={scrollRight}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default TitleCards;