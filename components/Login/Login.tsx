import React from 'react';
import './Login.scss'
import authLogin from '@/auth/login';

const quotes = [
  'What will you inspire today?',
  'Ready for some tuning?',
  'Mind the tempo!',
  <span>Check out official tutorial on <a href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>YT</a></span>,
  '',
]
/**
 * Panel logowania
 */
function Login() {
  const quoteId = Math.floor((Math.random() * (quotes.length - 1))) 

  return (
    <div className='login__wrapper'>
      <div className='login__box'>
        <div className="login__title-box">
          <h1>
            PlaylistOrganizer
          </h1>
          <a className="btn-spotify" onClick={() => authLogin()} >
            Login with Spotify 
          </a>
        </div>
        <div className="quote-box">
          Powered by <a href='https://developer.spotify.com/documentation/web-api'>Spotify API</a>
        </div>
      </div>
    </div>
  );
}

export default Login;