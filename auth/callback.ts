"use server"

import axios from 'axios';
import * as request from 'request';

export default async function authCallback(code: string) {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: process.env.REDIRECT_URI ?? 'http://localhost:3000',
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', {
        code: code,
        redirect_uri: process.env.REDIRECT_URI ?? 'http://localhost:3000',
        grant_type: 'authorization_code',
      
    }, {
      headers: {
        Authorization: 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
        'Content-Type' : 'application/x-www-form-urlencoded',
      }
    })
    
    return response.data.access_token
  }
  catch(e) {}
  return null
}