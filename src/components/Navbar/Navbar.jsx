import React, { useRef, useState, useEffect } from 'react';
import './Navbar.css';
import logo from '../../assets/logo.png';
import bell_icon from '../../assets/bell_icon.svg';
import profile_img from '../../assets/profile_img.png';
import caret_icon from '../../assets/caret_icon.svg';
import search_icon from '../../assets/search_icon.svg';
import { logout } from '../../firebase';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuItem, setActiveMenuItem] = useState('Home');
  const navRef = useRef();
  const searchInputRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    'Home',
    'TV Shows', 
    'Movies',
    'New & Popular',
    'My List',
    'Browse by Languages'
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        navRef.current?.classList.add('nav-dark');
      } else {
        navRef.current?.classList.remove('nav-dark');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.navbar-profile')) {
        setShowDropdown(false);
      }
      if (!event.target.closest('.navbar-search')) {
        setShowSearch(false);
        setSearchQuery('');
      }
      if (!event.target.closest('.navbar-left') && !event.target.closest('.mobile-menu-toggle')) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleMenuClick = (item) => {
    setActiveMenuItem(item);
    setShowMobileMenu(false);
    
    // Navigate based on menu item
    switch(item) {
      case 'Home':
        navigate('/');
        break;
      case 'TV Shows':
      case 'Movies':
      case 'New & Popular':
      case 'My List':
      case 'Browse by Languages':
        // These could navigate to specific routes in the future
        navigate('/');
        break;
      default:
        navigate('/');
    }
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log('Searching for:', searchQuery);
      // You could navigate to a search results page here
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    setActiveMenuItem('Home');
  };

  return (
    <div ref={navRef} className='navbar'>
      <div className='navbar-left'>
        <img 
          src={logo} 
          alt="Netflix" 
          className='navbar-logo'
          onClick={handleLogoClick}
        />
        
        <ul className='navbar-menu'>
          {menuItems.map((item) => (
            <li
              key={item}
              className={activeMenuItem === item ? 'active' : ''}
              onClick={() => handleMenuClick(item)}
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleMenuClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>

        <button 
          className='mobile-menu-toggle'
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          aria-label="Toggle mobile menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${showMobileMenu ? 'active' : ''}`}>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item}
              onClick={() => handleMenuClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className='navbar-right'>
        {/* Search */}
        <div className='navbar-search'>
          <button 
            className='search-toggle'
            onClick={handleSearchToggle}
            aria-label="Toggle search"
          >
            <img src={search_icon} alt="Search" style={{width: '20px', filter: 'brightness(0) invert(1)'}} />
          </button>
          <form onSubmit={handleSearchSubmit}>
            <input
              ref={searchInputRef}
              type="text"
              className={`search-input ${showSearch ? 'active' : ''}`}
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Kids Profile */}
        <div className='navbar-kids'>
          Kids
        </div>

        {/* Notifications */}
        <div className='navbar-notifications'>
          <img src={bell_icon} alt="Notifications" className='notification-icon' />
          <div className='notification-badge'></div>
        </div>

        {/* Profile Dropdown */}
        <div 
          className={`navbar-profile ${showDropdown ? 'active' : ''}`}
          onClick={handleProfileClick}
        >
          <img src={profile_img} alt="Profile" className='profile-avatar' />
          <img src={caret_icon} alt="Menu" className='profile-caret' />
          
          <div className={`profile-dropdown ${showDropdown ? 'active' : ''}`}>
            <button className='dropdown-item'>
              <span className='dropdown-icon'>👤</span>
              Manage Profiles
            </button>
            <button className='dropdown-item'>
              <span className='dropdown-icon'>📊</span>
              Account
            </button>
            <button className='dropdown-item'>
              <span className='dropdown-icon'>❓</span>
              Help Center
            </button>
            <div className='dropdown-divider'></div>
            <button 
              className='dropdown-item danger'
              onClick={handleLogout}
            >
              <span className='dropdown-icon'>🚪</span>
              Sign Out of Netflix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;