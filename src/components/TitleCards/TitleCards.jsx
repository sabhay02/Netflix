import React, { useRef, useEffect, useState } from 'react';
import './TitleCards.css';
import cards_data from '../../assets/cards/Cards_data'; 
import { Link } from 'react-router-dom';

const TitleCards = ({title,category}) => {
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
    cardsRef.current.scrollLeft += event.deltaY;
  };

  useEffect(() => {
  const endpoint = category ? category : "now_playing";
console.log("Fetching category:", endpoint);

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
        {apiData.map((card, index) => {
          return <Link  to={`/player/${card.id}`}className='card' key={index}>
            <img src={'https://image.tmdb.org/t/p/w500'+card.backdrop_path} alt={card.name} />
            <p>{card.original_title}</p>
          </Link>
})}
      </div>
    </div>
  );
};

export default TitleCards;
