import { useEffect, useState } from 'react'
import './DownloaderDialog.scss'
import { donloadUserData } from '../../utils/downloader'
import { FastCollectionDTO, fastifyCollection } from '../../dto/fastCollection.dto'
// import jsonData from './../../cache.json';
import { CollectionDTO } from '../../dto/collection.dto';
import spoxios from '../../utils/SpotifyAPI';
import axios from 'axios';
import authCallback from '@/auth/callback';

/**
 * Dialog pokazujący stan pobierania
 */
export default function DownloaderDialog({
  setData,
  code,
}: {
  setData: (data: FastCollectionDTO | null) => void,
  code: string,
}) {
  const [stage, setStage] = useState(0)
  const [comm, setComm] = useState('')
  const [stages, setStages] = useState<string[]>([])

  useEffect(() => {
    
    /*const songs = new Map(Object.entries(jsonData.songs))
    songs.forEach(e => { e.uri = e.song.uri})

    setData({
      user: jsonData.user,
      songs: songs,
      playlists: new Map(Object.entries(jsonData.playlists)),
      artists: new Map(Object.entries(jsonData.artists)),
    })
    return;*/

    const process = async () => {
      const token = await authCallback(code) 
      //const token = response.data.access_token
      
      spoxios.setToken(token);

      const data = await donloadUserData(
        setStages,
        setStage,
        setComm,
      )

      setData(data)
    }
    
    process()

    // return () => window.location.reload();
  }, [])

  return (
    <div className='downloader'>
      <div className='downloader__header'>
        <div><h1>Downloading data</h1></div> 
      </div>
      <div className='downloader__progress'>
        {stages.map((name, i) => {
          const isActive = i == stage
          const className = isActive ? 'downloading-step__header--active' : 'downloading-step__header'

          const elems = [
            <div className='downloader-step' key={i}>
              <div className='downloader-step__icon'>
                <div className={isActive ? 'dot-flashing' : ''}></div>
              </div>
              <div className={className}>
                {name}
              </div>
            </div>
          ];

          if(isActive) {
            elems.push(
              <div className='downloader-step__subtext' key="subtext">
                {comm}
              </div> 
            )
          }

          return elems
        }).flat()}
      </div>
    </div>
  )
}