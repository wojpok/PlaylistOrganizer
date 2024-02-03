import React from "react";
import { SongDTO } from "../../dto/api/song.dto";

import './SongEntry.scss'
import { SongLUT } from "../../dto/fastCollection.dto";

/**
 * Komponent renderujący pojedynczy wiersz w liście piosenek
 */
export function SongEntry(props: {
  song: SongLUT,
  setSelectedSong: (id: string | null) => void,

  addToClipboard: (id: SongLUT) => void,
  delFromClipboard: (id: SongLUT) => void,
  clipboardColl: Set<string>,

  dragAndDrop?: undefined | { handleDrag: (any) => void, handleDrop: (any) => void},
}) {
  const song = props.song;

  return (
    
    <div id={song.id} onClick={() => { props.setSelectedSong(song.id)}}
      {...(props.dragAndDrop ? {
        draggable: true,
        onDragOver: (ev) => ev.preventDefault(),
        onDragStart: props.dragAndDrop.handleDrag,
        onDrop: props.dragAndDrop.handleDrop,
      } : {})}
      className="song-entry">
      <div className="entry-button-wrapper">
        {!props.clipboardColl.has(song.id) 
          ? <button onClick={e => {e.preventDefault(); props.addToClipboard(song)}}   className="aligned-buttons"> Add </button>
          : <button onClick={e => {e.preventDefault(); props.delFromClipboard(song)}} className="aligned-buttons reject"> Remove </button>
        }
      </div>
      <div className="entry-title-wrapper"> 
        {song.song.name}
      </div>
      <div className="entry-artists-wrapper">
         {song.song.artists.map(e => {
          return (
            <div className="entry-artist" key={e.id}>
              {e.name}
            </div>
          )
        })} 
      </div>
    </div>
  )
}

