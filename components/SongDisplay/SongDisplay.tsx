import React, { ReactNode, useMemo, useState } from "react"
import { SongEntry } from "../SongEntry/SongEntry"
import { CollectionDTO } from "../../dto/collection.dto"
import { FastCollectionDTO, SongLUT } from "../../dto/fastCollection.dto"
import { SongDTO } from "../../dto/api/song.dto"
import { GroupingSelectionInput } from "../GroupingInput/GroupingInput"

import './SongDisplay.scss'
import { GroupedResult, Grouping } from "../../dto/grouping.dto"
import BucketTitle from "../BucketTitle/BucketTitle"
import { groupingKeyTranslation } from "../../utils/grouping"

/**
 * Komponent renderujący listę piosenek
 */
export function SongDisplay(props: {
  data: FastCollectionDTO,
  grouping: GroupedResult
  setSelectedSong: (id: string | null) => void,
  
  addToClipboard: (id: SongLUT) => void,
  delFromClipboard: (id: SongLUT) => void,
  clipboardColl: Set<string>,

  dragAndDrop?: undefined | { handleDrag: (_: any) => void, handleDrop: (_: any) => void}, 
}) {

  const strat = props.grouping.strat

  let prevGroup: string | number | undefined = props.grouping.strat == Grouping.None ? 0 : undefined;

  // tworzenie listy z piosenkami
  let els: ReactNode[] = props.grouping.results.map(el => {
    let header : null | ReactNode = null;

    // jeśli jest włączone grupowanie i zmienił się klucz, należy dodać również nagłówek nowej sekcji
    if(prevGroup != el.key) {
      prevGroup = el.key;

      header = <BucketTitle key={el.key} name={groupingKeyTranslation(strat, el.key)}/>
    }

    const entry = (
      <div key={el.song.id}>
        <SongEntry 
          song={el.song} 
          setSelectedSong={props.setSelectedSong} 
          addToClipboard={props.addToClipboard}
          delFromClipboard={props.delFromClipboard}
          clipboardColl={props.clipboardColl}
          dragAndDrop={props.dragAndDrop}
        />
      </div>
    )

    if(header !== null) {
      return [header, entry]
    }

    return entry
  }).flat()

  return (
    <>
      <div className="song-list">
        {els}
      </div>
    </>
  )
}