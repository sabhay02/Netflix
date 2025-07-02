import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import search_icon from '../../assets/search_icon.svg';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef();
  const navigate = useNavigate();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZmZkMTIzODE0ODU5MDQxOTM5MmUyZTJjMmU0MTA4NCIsIm5iZiI6MTc1MTI2OTMwMS4wODksInN1YiI6IjY4NjIzZmI1OGVhZDYxNDNhMjkxNWU2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WWmkkDXmW_ux9dNiRzpzyGxhPwj470F3NMXuMUGvWdc'
    }
  };

  const searchMovies = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    setShowResults(true);

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
        options
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchMovies(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMovieClick = (movieId) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/player/${movieId}`);
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowResults(true);
    }
  };

  return (
    <div className="search-container" ref={searchRef}>
      <input
        type="text"
        className="search-bar"
        placeholder="Search for movies, genres..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={handleInputFocus}
      />
      <img src={search_icon} alt="search" className="search-icon" />
      
      {showResults && (
        <div className="search-results">
          {isLoading ? (
            <div className="loading-results">Searching...</div>
          ) : searchResults.length > 0 ? (
            searchResults.slice(0, 8).map((movie) => (
              <div
                key={movie.id}
                className="search-result-item"
                onClick={() => handleMovieClick(movie.id)}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : 'https://via.placeholder.com/60x90?text=No+Image'
                  }
                  alt={movie.title}
                  className="search-result-poster"
                />
                <div className="search-result-info">
                  <div className="search-result-title">{movie.title}</div>
                  <div className="search-result-overview">
                    {movie.overview || 'No description available'}
                  </div>
                  {movie.vote_average > 0 && (
                    <div className="search-result-rating">
                      ⭐ {movie.vote_average.toFixed(1)}/10
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : searchQuery.trim() ? (
            <div className="no-results">No movies found for "{searchQuery}"</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;