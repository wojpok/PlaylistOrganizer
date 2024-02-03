import React, { useState, useEffect, useRef } from 'react'
import { Grouping } from '../../dto/grouping.dto'
import './GroupingInput.scss'
import { useDebouncedCallback } from 'use-debounce'

/**
 * Komponent modyfikujący parametry sortowania
 */
export function GroupingSelectionInput({ setGrouping}: {
  setGrouping: (grouping: {grouping: Grouping, asc: boolean}) => void
}) {
  const [value, setValue] = useState({grouping: Grouping.None, asc: true})
  const setParentState = useDebouncedCallback(setGrouping, 1000)

  return (
    <div className='sidebar-tab__section'>
      <h2>Sort by</h2>
      <select name="grouping" id="grouping" className='grouping-input__select' onChange={(e) => {
        const v = {grouping: +e.target.value, asc: value.asc}
        
        setValue(v)
        setParentState(v)
      }}>
        <option value={Grouping.None}>None</option>

        <option disabled></option>
        <option value={Grouping.Artist}>Artist</option>
        <option value={Grouping.Genre}>Genre</option>
        <option value={Grouping.Popularity}>Popularity</option>
        <option value={Grouping.ReleaseYear}>Release Year</option>

        <option disabled></option>
        <option value={Grouping.Danceability}>Danceability</option>
        <option value={Grouping.Energy}>Energy</option>
        <option value={Grouping.Speechiness}>Speechiness</option>
        <option value={Grouping.Instrumentalness}>Instrumentalness</option>
        <option value={Grouping.Liveness}>Liveness</option>
        <option value={Grouping.Valence}>Valence</option>

        <option disabled></option>
        <option value={Grouping.Tempo}>Tempo</option>
        <option value={Grouping.Loudness}>Loudness</option>
        <option value={Grouping.Key}>Key</option>
        <option value={Grouping.Mode}>Mode</option>
      </select>

     
      <div className='grouping-input__order'>
        <h3>Order:</h3>
        <div className={'grouping-input__order-option ' + (value.asc ? 'active' : '')}
          onClick={() => {
            const v = {grouping: value.grouping, asc: true}
            
            setValue(v)
            setParentState(v)
          }}>
          Ascending
        </div>
        <div className={'grouping-input__order-option ' + (!value.asc ? 'active' : '')}
          onClick={() => {
            const v = {grouping: value.grouping, asc: false}
            
            setValue(v)
            setParentState(v)
          }}>
          Descending
        </div>
      </div>
    </div>
  )
}
