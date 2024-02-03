import { z } from 'zod'

export interface FilterDTO {
  genres: string[],
  
  popularity:       [number, number],
  danceability:     [number, number],
  energy:           [number, number],
  loudness:         [number, number],
  speechiness:      [number, number],
  acousticness:     [number, number],
  instrumentalness: [number, number],
  valence:          [number, number],

  major: boolean,
  minor: boolean,
}

export const defaultFilter: FilterDTO = {
  genres: [],

  popularity:       [0, 10],
  danceability:     [0, 10],
  energy:           [0, 10],
  loudness:         [0, 10],
  speechiness:      [0, 10],
  acousticness:     [0, 10],
  instrumentalness: [0, 10],
  valence:          [0, 10],

  major: true,
  minor: true,
};

export interface SearchCriteriaDTO {
  type?: string,

  data?: Object
};