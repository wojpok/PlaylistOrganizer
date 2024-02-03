import React, {useState, useEffect} from 'react'
import { FastCollectionDTO } from '../../dto/fastCollection.dto';

import DialogContext from '../../utils/dialog';
import DownloaderDialog from '../../dialogs/Downloader/DownloaderDialog';
import { Main } from '../Main/Main';

/**
 * Moduł pobierający dane użytkownika przed rozpoczęciem pracy
 */
export function Downloader(props: { setToken: ((token: undefined | string) => void), code: string}) {
  const [data, setData] = useState<FastCollectionDTO | null>(null)

  useEffect(() => {
    if(data !== null) {
      DialogContext.close()
      return
    }

    DialogContext.show(
      <DownloaderDialog setData={setData} code={props.code}/>
    )
  }, [data])
  if (data !== null) {
    return <Main data={data} setToken={props.setToken}/>
  }

  return (
    <>
    </>
  )
}