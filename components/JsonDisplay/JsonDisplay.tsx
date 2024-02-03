import { FastCollectionDTO } from "../../dto/fastCollection.dto";

/**
 * Komponent używany do debugowania
 */
export function JsonDisplay(
  props: {data: FastCollectionDTO}
) {
  return (
    JSON.stringify({
      user: props.data.user,
      songs: Object.fromEntries(props.data.songs),
      artists: Object.fromEntries(props.data.artists),
      playlists: Object.fromEntries(props.data.playlists),
    }, null, 2)
  )
}