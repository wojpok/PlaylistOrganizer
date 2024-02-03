import { useEffect, useMemo, useState } from "react"
import { ClipboardDTO } from "../../dto/clipboard.dto"
import { FastCollectionDTO, SongLUT } from "../../dto/fastCollection.dto"
import { useIsMount } from "../../utils/useIsMount"
import DialogContext from "../../utils/dialog"
import { ChangePlaylistDialog, pickExisting, pickMerge, pickOriginal } from "../../dialogs/ChangePlaylistDialog/ChangePlaylistDialog"
import { UploadPlaylistDialog } from "../../dialogs/UploadPlaylistDialog/UploadPlaylistDialog"
import './PlaylistManipulator.scss'

const createNewKey = 'create-new-one'

/**
 * Komponent odpowiadający za konfigurację i przesyłanie playlisty
 */
export function PlaylistManipulator(props: {
  clipboard: ClipboardDTO,
  setClipboard: (v: ClipboardDTO) => void,

  data: FastCollectionDTO,
  setData: (data: FastCollectionDTO) => void,
}) {
  const [selectedPlaylist, setSetectedPlaylist]   = useState(createNewKey)
  const [playlistNameInput, setPlaylistNameInput] = useState('')

  // funkcja która rozwiązuje konflikty przy zmianie playlisty
  const modifyClipboard = (playlistId: string, decision: string = '') => {
    if(decision === pickExisting) {
      // wybieramy istniejąca selekcję, czyli nic nie trzeba robić
      return
    }

    if(decision === pickOriginal) {
      // tworzymy nowy clipboard od zera
      if(!props.data.playlists.has(playlistId)) {
        props.setClipboard({
          set: new Set(),
          order: [],
        })
        return
      }

      props.setClipboard({
        set: new Set(props.data.playlists.get(playlistId)!.content),
        order: props.data.playlists.get(playlistId)!.content!.map(e => {
          return props.data.songs.get(e)!
        })
      })

      return
    }

    if(decision === pickMerge || decision === '') {
      // dodajemy piosenki wybranej playlisty na koniec istniejącej
      const set = props.clipboard.set
      const order = props.clipboard.order

      if (!props.data.playlists.has(playlistId)) {
        return
      }

      const newOrder: SongLUT[] = []

      props.data.playlists.get(playlistId)!.content!.forEach(e => {
        if (!set.has(e)) {
          set.add(e)
          newOrder.push(props.data.songs.get(e)!)
        }
      })

      props.setClipboard({
        set: set,
        order: order.concat(newOrder),
      })

      return
    }
  }

  // akcja przy wyborze decyzji
  const onSelect = (playlistId: string) => {
    setSetectedPlaylist(playlistId)

    // trzeba podjąć decyzję jeśli nowo wybrana playlista jest niepusta
    const needDecision: boolean = (
      (   playlistId == createNewKey 
      ||  props.data.playlists.get(playlistId)!.content!.length > 0
      ) 
      &&  props.clipboard.order.length > 0
    );

    if(needDecision) {
      DialogContext.show(
        <ChangePlaylistDialog 
          setDecision={(decision: string) => {
            modifyClipboard(playlistId, decision)
            DialogContext.close()
          }}
        />
      )
    }
    else {
      modifyClipboard(playlistId, '')
    }
  }

  return (
    <div className="sidebar-tab__section">
      <h2>
        Select playlist to modify:
      </h2>
      <div className="playlist-manipulator__select">
        <select name="grouping" id="grouping" onChange={(e) => onSelect(e.target.value)}>
          <option value={createNewKey}>Create new one</option>
          { Array
              .from(props.data.playlists.values())
              .filter(e => {return e.owner.id === props.data.user.id})
              .map(e => {return <option key={e.id} value={e.id} {...(e.id === selectedPlaylist ? {selected: true} : {})}>{e.name}</option>})
          }
        </select>
      </div>
      <div className="playlist-manipulator__input">
        <input 
          placeholder="Playlist name"
          className="text-input"
          type="text" 
          onChange={e => setPlaylistNameInput(e.target.value)}
          {...(selectedPlaylist === createNewKey ? {} : {disabled: true})}
          value={playlistNameInput}
        />
      </div>

      <div>
        <button type='button' onClick={() => {
          DialogContext.show(
            <UploadPlaylistDialog 
              playlistId={selectedPlaylist === createNewKey ? '' : selectedPlaylist}
              playlistName={playlistNameInput || "New playlist"}
              data={props.data}
              clipboard={props.clipboard}
              preserveOrder={true}
              setData={props.setData}
            />
          )
        }}> Upload </button>

      </div>

    </div>
  )
}