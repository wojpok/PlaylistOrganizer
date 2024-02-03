import { PlaylistDTO } from "../dto/api/playlist.dto";
import { SongDTO } from "../dto/api/song.dto";
import { FastCollectionDTO, fastifyCollection } from "../dto/fastCollection.dto";
import { getArtistsById, getAudioFeaturesById, getLikedSongs, getPlaylistTracksById, getSavedPlaylists, getUserProfile } from "./SpotifyRepository";

const stages = [
  'Collecting liked songs',
  'Collecting saved playlists',
  'Collecting playlists\' songs',
  'Downloading audio features',
  'Downloading artists\' data',
  'Finalizing',
]

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms) );
}

/**
 * Główna metoda pobierająca treści użytkownika
 */
export async function donloadUserData(
  setStages: (stages: string[]) => void,
  setStage: (stage: number) => void,
  setComm: (comm: string) => void,
): Promise<FastCollectionDTO> {
  setStages(stages);
  setStage(0);

  const user = await getUserProfile()

  let songColl: Map<string, SongDTO> = new Map();

  const likedSongRes = await getLikedSongs((completed => {
    setComm(`${completed} donwloaded`)
  }), )

  for(const el of likedSongRes) {
    songColl.set(el.id, el);
  }

  setStage(1)
  setComm('')

  let playlistColl: Map<string, PlaylistDTO> = new Map()

  playlistColl.set('main', {
    uri: '',
    name: 'LikedSongs',
    id: 'main',
    public: false,
    collaborative: false,
    owner: {
      id: '',
      uri: '',
    },
    tracks: { total: likedSongRes.length },
    mutable: false,
    content: likedSongRes.map(el => el.id),
  })

  const listRes = await getSavedPlaylists();

  for(const el of listRes) {
    if (el.owner.id == user.id)
      playlistColl.set(el.id, el)
  }

  setStage(2)
  
  const maxPlylists = playlistColl.size;
  let prog = 1;

  for(const el of playlistColl.values()) {
    if(el.id == 'main') continue;

    setComm(`${el.name}`)

    const playlistContent = await getPlaylistTracksById(
      el.tracks.total,
      el.id,
    );

    playlistContent.forEach(el => {
      songColl.set(el.id, el)
    });

    el.content = playlistContent.map(el => el.id)
    prog++;
  }

  setStage(3)
  const maxAudioFeatures = songColl.size

  const audioFeatures = await getAudioFeaturesById(
    Array.from(songColl.values()).map(el => el.id),
    (completed) => {
      setComm(`Fetched ${completed}/${maxAudioFeatures}`)
    }
  );

  for(const el of audioFeatures) {
    const entry = songColl.get(el.id);
    if (entry)
      entry.features = el
  }

  const artistIdColl = new Set<string>();

  songColl.forEach(el => {
    el.artists.forEach(ar => {
      artistIdColl.add(ar.id ?? '')
    })
  })

  setStage(4)
  const maxAstists = artistIdColl.size;

  const artistColl = await getArtistsById(
    Array.from(artistIdColl.keys()),
    (completed) => {
      setComm(`Fetched ${completed}/${maxAstists}`)
    }
  );
  setStage(5);
  setComm('');

  // :D 
  await delay(500);

  return fastifyCollection({
    user: user,
    songs: Array.from(songColl.values()),
    artists: artistColl,
    playlists: Array.from(playlistColl.values()),
  })
};
