import React, { useEffect } from 'react'
import { Routes,Route, useNavigate, useLocation} from 'react-router-dom'
import Home from './pages/Home/Home'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

  import { ToastContainer } from 'react-toastify';
const App = () => {
   
const navigate = useNavigate();
const location = useLocation();

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("Logged In", user.uid);
      if (location.pathname === '/login') {
        navigate('/');
      }
    } else {
      console.log("Logged Out");
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
  });

  return () => unsubscribe();
}, [navigate, location]);

  return (
    <div>
         <ToastContainer theme='dark'/>
      <Routes >
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/player/:id' element={<Player />} />
      </Routes>
    </div>
  )
}

export default App
