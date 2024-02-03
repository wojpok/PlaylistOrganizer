import { GroupedResult } from "../dto/grouping.dto"
import { FilterDTO } from "../dto/searchCriteria.dto"
import { SongDTO } from "../dto/api/song.dto"
import { normalizeString } from "../dto/fastCollection.dto"

const checkRange = (prop: number, range: [number, number], normalize = false) => {
  if(normalize) {
    const normalizedProp = prop
    return range[0] <= normalizedProp && normalizedProp <= range[1]
  }
  return range[0] <= prop && prop <= range[1]
}

// algorytm filtrowania
export default function filterSongsByParams(songList: GroupedResult, filter: FilterDTO): GroupedResult {
  const nSongList = songList.results.filter(el => {
    const features = el.song;

    if(features === null || features === undefined) { return false; }

    return (true
      && (features.mode === true ? filter.major : filter.minor)
      && checkRange(el.song.popularity ?? 0,    filter.popularity)
      && checkRange(features.danceability,      filter.danceability, true)
      && checkRange(features.energy,            filter.energy, true)
      && checkRange(features.speechiness,       filter.speechiness, true)
      && checkRange(features.acousticness,      filter.acousticness, true)
      && checkRange(features.instrumentalness,  filter.instrumentalness, true)
      && checkRange(features.valence,           filter.valence, true)
    );
  })

  return {
    results: nSongList,
    strat: songList.strat
  }
}

export function filterSongsByName(songList: GroupedResult, filter: string | null): GroupedResult {
  if(filter === null) {
    return songList
  }

  const normalized = normalizeString(filter)

  if(normalized === '') {
    return songList
  }

  const reg = new RegExp(normalized)

  return {
    strat: songList.strat,
    results: songList.results.filter(e => {
      return reg.test(e.song.searchString)
    })
  }
}