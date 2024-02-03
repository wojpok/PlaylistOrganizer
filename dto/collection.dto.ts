import { ArtistDTO } from "./api/artist.dto";
import { PlaylistDTO } from "./api/playlist.dto";
import { SongDTO } from "./api/song.dto";
import { UserDTO } from "./api/user.dto";

export interface CollectionDTO {
  user: UserDTO,
  songs: SongDTO[],
  artists: ArtistDTO[],
  playlists: PlaylistDTO[],
}