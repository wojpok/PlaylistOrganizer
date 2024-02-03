import { FastCollectionDTO, SongLUT } from "../../dto/fastCollection.dto";
import { scaleKeys } from "../../dto/grouping.dto";
import './SongInspector.scss'

const findBestImage = (song: SongLUT): {url: string, width: number, height: number} => {
  if (!song.song.album || !song.song.album.images.length) {
    return {url: '', width: 0, height: 0};
  }

  const best =  song.song.album.images.reduce((prev, curr) => {
    if(curr.height * curr.width > prev.height * prev.width)
      return curr
    return prev
  }, {url: '', width: 0, height: 0})

  return best
}

/**
 * Komponent wyświetlający informacje o utworze
 */
export function SongInspector(props: {
  data: FastCollectionDTO,
  songId: string | null,
}) {
  if (props.songId === null) {
    return (
      <div className="sidebar-tab__section">{'Click on a song to inspect it in details'}</div>
    )
  }

  const song = props.data.songs.get(props.songId)!
  const image = findBestImage(song)

  return (
    <div className="song-inspector__wrapper">
      <div className="sidebar-tab__section">
        <div className="song-inspector__title">{song.song.name} </div>
        <div className="song-inspector__artist">{song.song.artists[0].name} </div>

        

        <img className="song-inspector__image" src={image.url}></img>

        <div className="song-inspector__release-date">
          Released on: {song.song.album?.release_date}
        </div>
      </div>
      {
      /*<div className="sidebar-tab__section">
        <button>
          Try out {'>'}
        </button>
      </div>*/
      }
      <div className="sidebar-tab__section">
        <div className="song-inspector__details">
          <div className="song-inspector__entry--left">Popularity:</div><div className="song-inspector__entry--right">{song.popularity}</div>
          <div className="song-inspector__entry--left">Danceability:</div><div className="song-inspector__entry--right"> {song.danceability} </div>
          <div className="song-inspector__entry--left">Energy: </div><div className="song-inspector__entry--right">{song.energy}</div> 
          <div className="song-inspector__entry--left">Speechiness:</div><div className="song-inspector__entry--right"> {song.speechiness}</div>
          <div className="song-inspector__entry--left">Instrumentalness:</div><div className="song-inspector__entry--right"> {song.instrumentalness} </div>
          <div className="song-inspector__entry--left">Liveness:</div><div className="song-inspector__entry--right"> {song.liveness} </div>
          <div className="song-inspector__entry--left">Valence:</div><div className="song-inspector__entry--right"> {song.valence} </div>
          <div className="song-inspector__entry--left">Tempo: </div><div className="song-inspector__entry--right">{song.tempo} </div>
          <div className="song-inspector__entry--left">Loudness: </div><div className="song-inspector__entry--right">{song.loudness} </div>
          <div className="song-inspector__entry--left">Key: </div><div className="song-inspector__entry--right">{song.key === -1 ? "Unknown" : scaleKeys[song.key]} </div>
          <div className="song-inspector__entry--left">Mode: </div><div className="song-inspector__entry--right">{song.mode ? 'major' : 'minor' } </div>
          <div className="song-inspector__entry--left">Release year: </div><div className="song-inspector__entry--right">{song.release_year } </div>
        </div>
      </div>
      
    </div>
  )
}