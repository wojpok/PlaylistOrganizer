import { GroupedResult, Grouping } from "../dto/grouping.dto";
import { SongDTO } from "../dto/api/song.dto";
import { SongLUT } from "../dto/fastCollection.dto";

// algorytm grupowania

// generator funkcji wybierających klucz z SongLUT
export const groupKey: ((key: Grouping) => (song: SongLUT) => (string | number | (number | string)[])) = function(key) {
  switch(key) {
    case Grouping.Artist:
      return (song) => song.artists[0] ?? 'Unknown artist'
    case Grouping.Genre:
      return (song) => song.genres[0] ?? 'Unknown genre'
      // return song => song.genres
    case Grouping.Popularity:
      return song => song.popularity
    case Grouping.ReleaseYear:
      return song => song.release_year

    case Grouping.Danceability:
      return (song) => song.danceability
    case Grouping.Energy:
      return song => song.energy
    case Grouping.Speechiness:
      return song => song.speechiness
    case Grouping.Instrumentalness:
      return song => song.instrumentalness
    case Grouping.Liveness:
      return song => song.liveness
    case Grouping.Valence:
      return song => song.valence

    case Grouping.Tempo:
      return song => song.tempo
    case Grouping.Loudness:
      return song => song.loudness

    case Grouping.Key:
      return song => song.key
    case Grouping.Mode:
      return song => +song.mode
  } 

  return _ => 0
}

// sortowanie
export default function groupBy(opts: {grouping: Grouping, asc: boolean}, songs: SongLUT[]): GroupedResult {
  // brak grupowania
  if(opts.grouping == Grouping.None) {
    return {
      strat: opts.grouping,
      results: songs.map(e => ({ key: 0, song: e }))
    }
  }

  // funkcja określająca kolejność
  const sortCallback = opts.asc 
    ? (a, b) => {
      if (a.key < b.key)
        return -1;
      if (a.key > b.key)
        return 1;
      return 0;
    }
    : (a, b) => {
      if (a.key < b.key)
        return 1;
      if (a.key > b.key)
        return -1;
      return 0;
    }
  
  const keySelector = groupKey(opts.grouping)

  // sortowanie
  const _songs = songs
    .map(e => {
      const keys = keySelector(e)

      if(keys instanceof Array) {
        return keys.map(key => ({key: key, song: e}))
      }
      
      return {key: keys, song: e}
    })
    .flat()
    .sort(sortCallback)

  return {
    strat: opts.grouping,
    results: _songs
  }
}

export function dummyGroup(songs: SongLUT[]): GroupedResult {
  return {
    strat: Grouping.None,
    results: songs.map(e => ({ key: 0, song: e }))
  }
}

// Metody z pretty printem
function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const scaleKeys = [
  'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'
]

export function groupingKeyTranslation(grouping: Grouping, key: string | number): string {
  switch(grouping){
    case Grouping.None:
      return ''
    case Grouping.Artist:
      return key + ''
    case Grouping.Genre:
      return capitalizeFirstLetter(key + '')
    case Grouping.Energy:
    case Grouping.Popularity:
    case Grouping.Danceability:
    case Grouping.Speechiness:
    case Grouping.Instrumentalness:
    case Grouping.Liveness:
    case Grouping.Valence:
      return `${key} - ${+key+1}`
    case Grouping.ReleaseYear:
    case Grouping.Loudness:
    case Grouping.Tempo:
      return key + ''

    case Grouping.Key:
      return (+key === -1) ? 'Unknown key' : scaleKeys[+key]
    case Grouping.Mode:
      return (+key === 0) ? 'Minor' : 'Major'
  }

  return 'Unknown group'
}