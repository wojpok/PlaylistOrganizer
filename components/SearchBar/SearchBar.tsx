import { useEffect, useState } from 'react'
import './SearchBar.scss'
import { useDebouncedCallback } from 'use-debounce'
import ClearButton from '../ClearButton/ClearButton'

/**
 * Komponent z polem wyszukiwania
 */
export function SearchBar(props: {
  setSongNameFilter: (filter: string | null) => void,
}) {
  const [state, setState] = useState<string | null>(null)

  const updateParent = useDebouncedCallback(props.setSongNameFilter, 1000)

  const setFilter = (v: (string | null)) => {
    setState(v)
    updateParent(v)
  }  

  return (
    <div className="sidebar-tab__section">
      <h2>Filter by name</h2>
      <div className='search_bar'>
        <input 
          className="search_bar--input text-input"
          placeholder="Search"
          type="text" 
          value={state ?? ''} 
          onChange={
          e => setFilter(
            e.target.value ?? null
          )
        }></input> 
        {/*<div className='search-bar__clear' onClick={() => setFilter(null)}>✕</div>*/}
        <ClearButton onClick={() => setFilter(null)}/>
      </div>
    </div>
  )

}