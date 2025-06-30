import React, { useEffect,useState } from 'react';
import './Player.css';
import back_arrow_icon from '../../assets/back_arrow_icon.png';
import { useNavigate, useParams } from 'react-router-dom';

const Player = () => {
  const {id}=useParams();
  const navigate=useNavigate()
  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: ""  
  });
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZmZkMTIzODE0ODU5MDQxOTM5MmUyZTJjMmU0MTA4NCIsIm5iZiI6MTc1MTI2OTMwMS4wODksInN1YiI6IjY4NjIzZmI1OGVhZDYxNDNhMjkxNWU2ZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WWmkkDXmW_ux9dNiRzpzyGxhPwj470F3NMXuMUGvWdc'
  }
};
useEffect(()=>{

fetch(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`, options)
  .then(res => res.json())
.then(res => {
  if (res.results && res.results.length > 0) {
    setApiData(res.results[0]);
  } else {
    console.warn("No video found.");
  }
})
  .catch(err => console.error(err));
},[])



  return (
    <div className='player'>
      <div className='back-button'>
        <img onClick={()=>navigate(-2)} src={back_arrow_icon} alt="Go back" className='back-icon' />
      </div>
      <div className='video-container'>
        <iframe
          width='90%'
          height='90%'
          src={`https://www.youtube.com/embed/${apiData.key}`}
          title='trailer'
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        ></iframe>
      </div>
      <div className='player-info'>
        <p className='info-date'>{apiData.published_at.slice(0,10)}</p>
        <p className='info-title'>{apiData.name}</p>
        <p className='info-type'>{apiData.type}</p>
      </div>
    </div>
  );
};

export default Player;