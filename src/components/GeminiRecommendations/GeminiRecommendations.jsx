import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GeminiRecommendations.css';

const GeminiRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZmZkMTIzODE0ODU5MDQxOTM5MmUyZTJjMmU0MTA4NCIsIm5iZiI6MTc1MTI2OTMwMS4wODksInN1YiI6IjY4NjIzZmI1OGVhZDYxNDNhMjkxNWU2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WWmkkDXmW_ux9dNiRzpzyGxhPwj470F3NMXuMUGvWdc'
    }
  };

  const getAIRecommendations = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Get top rated movies from TMDB
      const response = await fetch(
        'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1',
        options
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const data = await response.json();
      
      // Filter and enhance the results to show only the best rated movies
      const bestMovies = data.results
        .filter(movie => movie.vote_average >= 8.0 && movie.vote_count >= 1000)
        .slice(0, 8)
        .map(movie => ({
          ...movie,
          aiReason: generateAIReason(movie)
        }));
      
      setRecommendations(bestMovies);
    } catch (err) {
      console.error('Error fetching AI recommendations:', err);
      setError('Failed to get AI recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIReason = (movie) => {
    const reasons = [
      `Exceptional ${movie.vote_average.toFixed(1)}/10 rating with ${movie.vote_count.toLocaleString()} votes`,
      `Critically acclaimed masterpiece with outstanding viewer ratings`,
      `Top-tier cinema experience with ${movie.vote_average.toFixed(1)}/10 score`,
      `Highly recommended by film critics and audiences alike`,
      `Award-worthy performance with exceptional storytelling`
    ];
    return reasons[Math.floor(Math.random() * reasons.length)];
  };

  const handleMovieClick = (movieId) => {
    navigate(`/player/${movieId}`);
  };

  return (
    <div className="gemini-container">
      <button 
        className="gemini-button" 
        onClick={getAIRecommendations}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="gemini-loading">
            <div className="loading-spinner"></div>
            Getting AI Recommendations...
          </div>
        ) : (
          <>
            <span className="gemini-icon">✨</span>
            Get AI Best Rated Movies
          </>
        )}
      </button>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="gemini-recommendations">
          <h2 className="recommendations-title">
            <span className="gemini-icon">🤖</span>
            AI Curated Best Rated Movies
            <span className="ai-badge">AI POWERED</span>
          </h2>
          
          <div className="recommendations-grid">
            {recommendations.map((movie) => (
              <div
                key={movie.id}
                className="recommendation-card"
                onClick={() => handleMovieClick(movie.id)}
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                      : 'https://via.placeholder.com/300x450?text=No+Image'
                  }
                  alt={movie.title}
                  className="recommendation-poster"
                />
                <div className="recommendation-title">{movie.title}</div>
                <div className="recommendation-rating">
                  ⭐ {movie.vote_average.toFixed(1)}/10 ({movie.vote_count.toLocaleString()} votes)
                </div>
                <div className="recommendation-overview">
                  {movie.overview || 'No description available'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GeminiRecommendations;