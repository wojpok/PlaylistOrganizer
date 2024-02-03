import { FastCollectionDTO, SongLUT } from "../dto/fastCollection.dto";
import { SongDTO } from "../dto/api/song.dto";

// algorytm zbierający piosenki z wybranych playlist
export default function collectSongs(data: FastCollectionDTO, selected: Record<string, boolean>): SongLUT[] {
  let songlist: string[] = []

  for(const el of data.playlists.values()) {
    if(selected[el.id] ?? false) {
      songlist = songlist.concat(el.content ?? [])
    }
  }

  const songSet = new Set(songlist);

  return Array.from(songSet.keys()).map(id => data.songs.get(id)!);
}