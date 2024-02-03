import { useEffect } from "react"
import { useIsMount } from "../../utils/useIsMount"
import { addSongToPlaylist, createNewPlaylist, getPlaylistTracksById, removeSongs, reorderPlaylistItems } from "../../utils/SpotifyRepository"
import { PlaylistDTO } from "../../dto/api/playlist.dto"
import { FastCollectionDTO } from "../../dto/fastCollection.dto"
import { ClipboardDTO } from "../../dto/clipboard.dto"
import { calculateDeltas } from "../../utils/calculateDeltas"
import DialogContext from "../../utils/dialog"

/**
 * Dialog zarządzający przesyłaniem playlisty do serwisu Spotify
 */
export function UploadPlaylistDialog(props: {
  playlistId?: string | null,
  playlistName: string,
  data: FastCollectionDTO,
  clipboard: ClipboardDTO,
  preserveOrder: boolean,
  setData: (data: FastCollectionDTO) => void,
}) {

  useEffect(() => {

    const process = async () => {
      let playlist: PlaylistDTO

      if(!props.playlistId) {
        // tworzenie nowej playlisty
        playlist = await createNewPlaylist(props.playlistName, props.data.user.id)
        playlist.content = []
      }
      else {
        playlist = props.data.playlists.get(props.playlistId)!
      }

      // obliczanie delt
      const originalContent = new Set(playlist.content)
      const contentToAdd = props.clipboard.order.filter(e => {
        return !originalContent.has(e.id)
      });

      const contentToRemove = playlist.content!.filter(e => {
        return !props.clipboard.set.has(e)
      }).map(e => props.data.songs.get(e)!);

      await removeSongs(playlist.id, contentToRemove)
      await addSongToPlaylist(playlist.id, contentToAdd)

      // zmiana kolejności piosenek
      if (props.preserveOrder) {
        const curr = (await getPlaylistTracksById(playlist.tracks.total, playlist.id))

        if (curr.length == props.clipboard.order.length) {
          const deltas = calculateDeltas(
            props.clipboard.order.map(e => e.id), 
            curr.map(e => e.id)
          )
  
          for (const delta of deltas) {
            reorderPlaylistItems(playlist.id, delta);
          }
        }
      }

      // aktualizacja danych
      if(!props.playlistId) {
        playlist.content = props.clipboard.order.map(e => e.id),
        props.data.playlists.set(playlist.id, playlist)
      }
      else {
        props.data.playlists.get(props.playlistId)!.content = props.clipboard.order.map(e => e.id)
      }

      props.setData({...props.data})
      DialogContext.close();
    }

    process()
    // props.onEnd()
  }, [])


  return (
    <>
      Stay tuned while we are uploading your playlist
    </>
  )
}