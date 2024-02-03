import { ArtistDTO } from "./api/artist.dto";
import { CollectionDTO } from "./collection.dto";
import { PlaylistDTO } from "./api/playlist.dto";
import { SongDTO } from "./api/song.dto";
import { UserDTO } from "./api/user.dto";

// zmodyfikowany obiekt piosenki, przyśpiesza wyszukiwanie
export interface SongLUT {
  id: string,
  uri: string,
  song: SongDTO,

  release_year: number,
  danceability: number,
  energy: number,
  key: number,
  loudness: number,
  mode: boolean,
  speechiness: number,
  acousticness: number,
  instrumentalness: number,
  liveness: number,
  valence: number,
  tempo: number,
  duration: number,
  time_signature: number,

  popularity: number,
  genres: string[],
  genreSearchString: string,
  artists: string[],
  searchString: string,
}

export const normalizeString = (value: string): string => {
  return value.toLowerCase().replace(/\s+/g, '')
}

export const normalize = (value: number): number => {
  const v = Math.floor(value * 10);
  return v - +(v == 10)
}

const releaseYear = (value: string): number => {
  return +(value.split('-')[0])
}

// zamiana SongDTO w SongLUT
const makeLUT = (song: SongDTO, artists: Map<string, ArtistDTO>): SongLUT => {
  const artistsNames = song.artists.map(e => e.name)
  const genres = Array.from(new Set( song.artists.map(e => {
    return artists.get(e.id ?? '')?.genres ?? []
  }).flat()))

  const genreLut = genres.reduce((acc, x) => acc + ' | ' + x, '')
  
  return {
    id: song.id,
    song: song,
    uri: song.uri,

    danceability:     normalize(song.features?.danceability ?? 0),
    energy:           normalize(song.features?.energy ?? 0),
    speechiness:      normalize(song.features?.speechiness ?? 0),
    acousticness:     normalize(song.features?.acousticness ?? 0),
    instrumentalness: normalize(song.features?.instrumentalness ?? 0),
    liveness:         normalize(song.features?.liveness ?? 0),
    valence:          normalize(song.features?.valence ?? 0),

    loudness: song.features?.loudness ?? 0,
    tempo: song.features?.tempo ?? 0,
    
    mode: !!song.features?.key ?? false,
    key: song.features?.key ?? -1,
    time_signature: song.features?.time_signature ?? -1,
    duration: song.features?.duration_ms ?? 0,
    
    release_year: releaseYear(song.album?.release_date ?? '0'),
    popularity: normalize((song.popularity ?? 0) / 100),
    artists: artistsNames,
    genres: genres,
    genreSearchString: normalizeString(genreLut),
    searchString: normalizeString(song.name + ' ' + artistsNames.reduce((acc, x) => acc + ' ' + x, '')),
  }
}

// Zamiana zwykłej kolekcji danych w kolekcję z mapami do szybszego wyszukiwania danych
export interface FastCollectionDTO {
  user: UserDTO,
  songs: Map<string, SongLUT>
  artists: Map<string, ArtistDTO>
  playlists: Map<string, PlaylistDTO>
}

export function fastifyCollection(coll: CollectionDTO): FastCollectionDTO {
  const songs = new Map<string, SongLUT>()
  const artists = new Map<string, ArtistDTO>()
  const playlists = new Map<string, PlaylistDTO>()

  for(const el of coll.artists) {
    artists.set(el.id, el)
  }

  for(const el of coll.songs) {
    el.searchString = `${el.name} ${el.artists[0]?.name ?? ''}`.toLowerCase().replace(/\s+/g, '');

    songs.set(el.id, makeLUT(el, artists))
  }

  for(const el of coll.playlists) {
    playlists.set(el.id, el)
  }

  return {
    user: coll.user,
    songs: songs,
    artists: artists,
    playlists: playlists
  }
}