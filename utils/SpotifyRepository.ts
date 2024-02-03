import spoxios from "./SpotifyAPI";
import { SongDTO, SongParser } from "../dto/api/song.dto";
import { PlaylistDTO, PlaylistParser } from "../dto/api/playlist.dto";
import { ArtistDTO, ArtistParser } from "../dto/api/artist.dto";
import { AudioFeaturesDTO, ParseAudioFeatures } from "../dto/api/audioFeatures.dto";
import { ReorderDTO } from "../dto/reorder.dto";
import { UserDTO, UserParser } from "../dto/api/user.dto";
import { SongLUT } from "../dto/fastCollection.dto";

// zbiór metod operujących na API Spotify

function chunkArray<T> (arr: T[], chunkSize: number = 50): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
}

type callbackFn<T> = (data: T[]) => void

export async function getLikedSongs(
  onBatchLoad: ((completed: number) => void) | undefined = undefined,
  onFinish:    callbackFn<SongDTO> | undefined = undefined,
): Promise<SongDTO[]> {
  const getTracksByOffset = async function(limit: number, offset: number) {
    return await spoxios.axios
      .get(`/me/tracks?limit=${limit}&offset=${offset}`)
      .then(res => { return res.data })
  }

  let coll: SongDTO[] = [];

  for(let i = 0;; i += 50) {
    let res = await getTracksByOffset(50, i);
    for(let el of res.items) {
      if(el.track.id !== null)
        coll.push(SongParser.parse(el.track))
    }

    if(onBatchLoad) {
      onBatchLoad(i + res.items.length)
    }

    if(res.items.length < 50) break;
  }

  if(onFinish) {
    onFinish(coll)
  }

  return coll;
}
export async function getSavedPlaylists(
  onFinish: callbackFn<PlaylistDTO> | undefined = undefined,
): Promise<PlaylistDTO[]> {
  let coll: PlaylistDTO[] = []

  const getPartial = async (limit: number, offset: number) => 
    await spoxios.axios
      .get(`/me/playlists?limit=${limit}&offset=${offset}`)
      .then((_: any) => { return (_.data)})

  for(let i = 0;; i += 50) {
    let res = await getPartial(50, i);

    for(let el of res.items) {
      coll.push(PlaylistParser.parse(el))
      // coll.push((el))
    }

    if(res.items.length < 50) break;
  }

  if(onFinish) {
    onFinish([...coll])
  }
  
  return coll
}

export async function getPlaylistTracksById (
  total: number,
  playlistId: string,
  onFinish: callbackFn<SongDTO> | undefined = undefined,
): Promise<SongDTO[]> {
  let getPartial = async (limit: number, offset: number) =>
    await spoxios.axios
      .get(`/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`)
      .then(_ => _.data)
  
  let coll: SongDTO[] = [];        
  for(let i = 0;; i++) {
    let res = await getPartial(50, 50 * i);
    for(let el of res.items) {
      if(el.track.id !== null)
        coll.push(SongParser.parse(el.track))
    }

    if(res.items.length < 50 || ((i + res.items.length) >= total)) break;
  }

  if(onFinish) {
    onFinish([...coll])
  }

  return coll;
}

export async function getArtistsById(
  ids: string[],
  onBatchLoad: ((completed: number) => void) | undefined = undefined,
  onFinish: callbackFn<ArtistDTO> | undefined = undefined
): Promise<ArtistDTO[]> {
  let slices = chunkArray(ids, 50)

  let els: ArtistDTO[] = []

  let ttl = 0;
  for (let slice of slices) {
    let ids = slice.filter(_ => _).join(',')

    if(ids === '') continue;

    let data = await spoxios.axios
      .get(`/artists?ids=${ids}`)
      .then(_ => _.data.artists)

    for(let el of data) {
      if (el !== null)
        els.push(ArtistParser.parse(el))
    }

    ttl += data.length
    if(onBatchLoad) {
      onBatchLoad(ttl)
    }

    //els = els.concat(...data)
  }

  if(onFinish) {
    onFinish([...els])
  }

  return els
}

export async function getAudioFeaturesById (
  uris: string[], 
  onBatchLoad: ((completed: number) => void) | undefined = undefined,
  onFinish: callbackFn<AudioFeaturesDTO> | undefined = undefined
): Promise<AudioFeaturesDTO[]> {
  let slices = chunkArray(uris, 100)
  let ttl = 0;

  let els: AudioFeaturesDTO[] = []

  for (let slice of slices) {
      let ids = slice.filter(_ => _).join(',')

      if(ids === '') continue;

      let data = await spoxios.axios
        .get(`/audio-features?ids=${ids}`)
        .then(_ => _.data.audio_features)
      
      for(let el of data) {
        if (el !== null)
          els.push(ParseAudioFeatures.parse(el))
      }

      ttl += data.length

      if(onBatchLoad) {
        onBatchLoad(ttl)
      }

      // els = els.concat(...data)
  }

  if(onFinish) {
    onFinish([...els])
  }

  return els
}

export async function createNewPlaylist(
  name: string,
  userId: string,
): Promise<PlaylistDTO> {
  const res = await spoxios.axios
    .post(`/users/${userId}/playlists`, {
      "name": name,
      "description": "New playlist description",
      "public": false
    })

  return PlaylistParser.parse(res.data)
}

export async function removeSongs(id: string, songs: (SongLUT | {uri: string})[]) {
  let slices = chunkArray(songs, 50);

  for(let slice of slices) {
    await spoxios.axios
      .delete(`/playlists/${id}/tracks`, {
          data: {"tracks": slice.map(e => {return {uri: e.uri}})}
        }
      )
      .then(_ => _)
  }
}

export async function addSongToPlaylist(id: string, songs: SongLUT[]) {
  let slices = chunkArray(songs, 50)

  for(let slice of slices) {
    await spoxios.axios
      .post(`/playlists/${id}/tracks`, {
        "uris": slice.map(e => e.uri),
        "position": 0,
      }).then(_ => _.data)
  }
}

export async function reorderPlaylistItems(
  id: string, 
  reorder: ReorderDTO,
) {
  return await spoxios.axios
    .put(`/playlists/${id}/tracks`, {
      ...reorder
    })
}

export async function getUserProfile(): Promise<UserDTO> {
  const data = (await spoxios.axios.get('/me')).data

  return UserParser.parse(data)
}