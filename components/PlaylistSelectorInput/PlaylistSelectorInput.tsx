import { CollectionDTO } from "../../dto/collection.dto";
import { FastCollectionDTO } from "../../dto/fastCollection.dto";
import './PlaylistSelectorInput.scss'

/**
 * Komponent pozwalający wybrać playlisty do modyfikacji
 */
export function PlaylistSelectorInput(props: {
  data: FastCollectionDTO, 
  selected: Record<string, boolean>,
  setSelected: (data: Record<string, boolean>) => void,
}) {
  let form = Array.from(props.data.playlists.values()).map(el => {
    return (<div key={el.id}>
      <input 
        className="playlist-selector__checkbox"
        id={el.id} 
        type='checkbox' 
        defaultChecked={props.selected[el.id] ?? false}
        onChange={e => {
          props.selected[el.id] = e.target.checked;
          const nSel = {...props.selected}
          nSel[el.id] = e.target.checked
          props.setSelected(nSel);
        }}
      ></input>
      <label htmlFor={el.id}>{el.name}</label>
      <br />
      </div>)
  })

  return (
    <div className="sidebar-tab__section playlist-selector__wrapper">
      <h2>Select playlists</h2>
      <form>
        {form}
      </form>
    </div>
  )
}