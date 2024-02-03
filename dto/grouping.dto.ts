import { SongDTO } from "./api/song.dto";
import { SongLUT } from "./fastCollection.dto";

export const scaleKeys = [
  'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'
]

export enum Grouping {
  None = 0,

  Artist = 1,
  Genre = 2,
  Popularity = 3,
  ReleaseYear = 14,

  Danceability = 4,
  Energy = 5,
  Speechiness = 8,
  Instrumentalness = 9,
  Liveness = 10,
  Valence = 11,

  Tempo = 12,
  Loudness = 13,
  Key = 6,
  Mode = 7,
}

export interface GroupedResult {
  strat: Grouping,
  results: { key: number | string, song: SongLUT }[],
}