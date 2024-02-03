"use server"

import { redirect } from "next/navigation";

function randomString(length: number): string {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export default async function authLogin() {
  const scope = " \
    playlist-read-private \
    playlist-read-collaborative \
    playlist-modify-private \
    playlist-modify-public \
    user-read-playback-position \
    user-library-modify \
    user-library-read \
    user-read-email \
    user-read-private \
    streaming \
    "

  const state = randomString(16);

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID ?? "", // this.appService.spotify_client_id,
    scope: scope,
    redirect_uri: process.env.REDIRECT_URI ?? "http://localhost:3000",
    state: state
  })

  // res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());

  redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString())
}