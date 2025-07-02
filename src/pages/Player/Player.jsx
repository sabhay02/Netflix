import React, { useEffect, useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useParams } from 'react-router-dom';

const Player = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoData, setVideoData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""
  });
  const [movieData, setMovieData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZmZkMTIzODE0ODU5MDQxOTM5MmUyZTJjMmU0MTA4NCIsIm5iZiI6MTc1MTI2OTMwMS4wODksInN1YiI6IjY4NjIzZmI1OGVhZDYxNDNhMjkxNWU2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WWmkkDXmW_ux9dNiRzpzyGxhPwj470F3NMXuMUGvWdc'
    }
  };

  const fetchMovieData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch movie details
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
        options
      );
      const movieResult = await movieResponse.json();

      if (movieResponse.ok) {
        setMovieData(movieResult);
      }

      // Fetch movie videos
      const videoResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`,
        options
      );
      const videoResult = await videoResponse.json();

      if (videoResponse.ok && videoResult.results && videoResult.results.length > 0) {
        // Prioritize trailers, then teasers, then any video
        const trailer = videoResult.results.find(video => 
          video.type === 'Trailer' && video.site === 'YouTube'
        );
        const teaser = videoResult.results.find(video => 
          video.type === 'Teaser' && video.site === 'YouTube'
        );
        const anyVideo = videoResult.results.find(video => video.site === 'YouTube');

        const selectedVideo = trailer || teaser || anyVideo;
        
        if (selectedVideo) {
          setVideoData(selectedVideo);
        } else {
          setError('No video available for this movie');
        }
      } else {
        setError('No video found for this movie');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load movie data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMovieData();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getGenres = (genres) => {
    if (!genres || genres.length === 0) return [];
    return genres.slice(0, 3); // Show max 3 genres
  };

  const handleRetry = () => {
    fetchMovieData();
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (error && !movieData) {
    return (
      <div className='player'>
        <div className='player-header'>
          <button className='back-button' onClick={handleGoBack}>
            <img src={back_arrow_icon} alt="Go back" className='back-icon' />
            Back
          </button>
        </div>
        <div className='error-container'>
          <div className='error-icon'>⚠️</div>
          <h2 className='error-title'>Oops! Something went wrong</h2>
          <p className='error-message'>{error}</p>
          <button className='retry-button' onClick={handleRetry}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='player'>
      <div className='player-header'>
        <button className='back-button' onClick={handleGoBack}>
          <img src={back_arrow_icon} alt="Go back" className='back-icon' />
          Back
        </button>
        {movieData && (
          <h1 className='player-title-header'>{movieData.title}</h1>
        )}
      </div>

      <div className='video-section'>
        <div className='video-container'>
          {isLoading ? (
            <div className='video-placeholder'>
              <div className='loading-spinner'></div>
              <p>Loading video...</p>
            </div>
          ) : videoData.key ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoData.key}?autoplay=0&rel=0&modestbranding=1`}
              title={videoData.name || 'Movie Video'}
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
            />
          ) : (
            <div className='video-placeholder'>
              <div className='placeholder-icon'>🎬</div>
              <p>No video available</p>
              <small>This movie doesn't have a trailer or video available</small>
            </div>
          )}
        </div>

        {movieData && (
          <div className='movie-details'>
            <div className='movie-header'>
              {movieData.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movieData.poster_path}`}
                  alt={movieData.title}
                  className='movie-poster'
                />
              )}
              <div className='movie-info'>
                <h1 className='movie-title'>{movieData.title}</h1>
                
                <div className='movie-meta'>
                  {movieData.vote_average > 0 && (
                    <div className='rating-badge'>
                      <span>⭐</span>
                      <span>{movieData.vote_average.toFixed(1)}/10</span>
                    </div>
                  )}
                  <div className='meta-item'>
                    <span>📅</span>
                    <span>{formatDate(movieData.release_date)}</span>
                  </div>
                  {movieData.runtime && (
                    <div className='meta-item'>
                      <span>⏱️</span>
                      <span>{formatRuntime(movieData.runtime)}</span>
                    </div>
                  )}
                  {movieData.vote_count > 0 && (
                    <div className='meta-item'>
                      <span>👥</span>
                      <span>{movieData.vote_count.toLocaleString()} votes</span>
                    </div>
                  )}
                </div>

                {movieData.genres && movieData.genres.length > 0 && (
                  <div className='genre-tags'>
                    {getGenres(movieData.genres).map((genre) => (
                      <span key={genre.id} className='genre-tag'>
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}

                {movieData.overview && (
                  <p className='movie-overview'>{movieData.overview}</p>
                )}

                {videoData.key && (
                  <div className='video-info'>
                    <h3 className='video-title'>{videoData.name}</h3>
                    <div className='video-meta'>
                      <span>
                        <span>🎬</span>
                        {videoData.type}
                      </span>
                      {videoData.published_at && (
                        <span>
                          <span>📅</span>
                          {formatDate(videoData.published_at)}
                        </span>
                      )}
                      <span>
                        <span>📺</span>
                        YouTube
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Player;