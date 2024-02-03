import { useEffect, useMemo, useState } from "react";
import { FilterDTO, defaultFilter } from "../../dto/searchCriteria.dto";
import { FilterInput } from "../Filter/Filter";
import SidebarTabs, { SidebarTab } from "../SidebarTabs/SidebarTabs";
import { FastCollectionDTO, SongLUT } from "../../dto/fastCollection.dto";
import { PlaylistSelectorInput } from "../PlaylistSelectorInput/PlaylistSelectorInput";
import { SongDisplay } from "../SongDisplay/SongDisplay";
import { useDebounce } from "use-debounce";
import { ClipboardDTO } from "../../dto/clipboard.dto";
import { SongInspector } from "../SongInspector/SongInspector";
import { Tabs } from "../Tabs/Tabs";
import { PlaylistManipulator } from "../PlaylistManipulator/PlaylistManipulator";

import './Main.scss'
import { GroupingSelectionInput } from "../GroupingInput/GroupingInput";
import groupBy, { dummyGroup } from "../../utils/grouping";
import { Grouping } from "../../dto/grouping.dto";
import collectSongs from "../../utils/playlistCollector";
import filterSongsByParams, { filterSongsByName } from "../../utils/songFilter";
import clipboardFunctions from "../../utils/clipboardManip";
import { SearchBar } from "../SearchBar/SearchBar";
import Navbar from "../Navbar/Navbar";
import { JsonDisplay } from "../JsonDisplay/JsonDisplay";

/**
 * Główny komponent aplikacji
 * Komponuje cały widok i kontroluje przepływ algorytmu wyszukiwania
 */
export function Main(props: {
  data: FastCollectionDTO,
  setToken: (token : string | undefined) => void
}) {
  const [data, setData] = useState<FastCollectionDTO>(props.data)
  const [clipboard, setClipboard] = useState<ClipboardDTO>({order: [], set: new Set()});
  const [dragId, setDragId] = useState<string>('');
  const [songSelection, setSongSelection] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterDTO>(defaultFilter);
  // const [debouncedFilter]   = useDebounce(filter, 1000);
  const debouncedFilter = filter; // <----------- debounced in Filter

  const [selectedPlaylists, setSelectedPlaylists] = useState<Record<string, boolean>>({'main': true});
  const [debouncedSelectedPlaylists]              = useDebounce(selectedPlaylists, 1000);

  const [grouping, setGrouping] = useState<{grouping: Grouping, asc: boolean}>({grouping: Grouping.None, asc: true});
  // const [debouncedGrouping]     = useDebounce(grouping, 1000);
  const debouncedGrouping = grouping; // <--- debounced in GroupingInput

  const [songNameFilter, setSongNameFilter] = useState<null | string>(null)
  //const [debouncedSongNameFilter]           = useDebounce(songNameFilter, 700);
  const debouncedSongNameFilter = songNameFilter; // <------ debounced in SearchBar

  // ============================================ ALGORYTM WYSZUKIWANIA ===================================================
  const songList              = useMemo(() => collectSongs(props.data, debouncedSelectedPlaylists),       [props.data, debouncedSelectedPlaylists]);
  const groupedSongList       = useMemo(() => groupBy(debouncedGrouping, songList),                       [debouncedGrouping, songList])
  const nameFilteredSongList  = useMemo(() => filterSongsByName(groupedSongList, debouncedSongNameFilter),[groupedSongList, debouncedSongNameFilter]);
  const outFilteredSongList   = useMemo(() => filterSongsByParams(nameFilteredSongList, debouncedFilter), [debouncedFilter, nameFilteredSongList]);
  const current_list          = useMemo(() => dummyGroup(clipboard.order),                                [clipboard])

  const [addItemToClipboard, removeItemFromClipboard] = useMemo(() =>clipboardFunctions(clipboard, setClipboard), [clipboard, setClipboard]) 

  // drag & drop w panelu edycji
  const handleDrag = (ev: any) => {
    setDragId(ev.currentTarget.id);
  };

  const handleDrop = (ev: any) => {
    const dragFrom = clipboard.order.findIndex((song: SongLUT) => song.id === dragId);
    const dragTo = clipboard.order.findIndex((song: SongLUT) => song.id === ev.currentTarget.id);

    const newArray = [...clipboard.order];
    const [draggedItem] = newArray.splice(dragFrom, 1);
    newArray.splice(dragTo, 0, draggedItem);

    setClipboard({
      set: clipboard.set, 
      order: newArray,
    });
  };

  return (
    <div className="main__wrapper">
      <Navbar setToken={props.setToken} />
      <div className="main--container">
        <div className="main--sidebar">
          <SidebarTabs>
            <SidebarTab ico="albums.svg">
              <PlaylistSelectorInput 
                selected={selectedPlaylists}
                setSelected={setSelectedPlaylists}
                data={data}
              />
            </SidebarTab>
            
            <SidebarTab ico="filters.svg">
              <SearchBar 
                setSongNameFilter={setSongNameFilter}
              />
              <GroupingSelectionInput
                setGrouping={setGrouping}
              />
              <FilterInput 
                filter={filter} 
                setFilter={setFilter}
              />
            </SidebarTab>
            <SidebarTab ico="information.svg">
              <SongInspector 
                data={data}
                songId={songSelection}
              />
            </SidebarTab>
            <SidebarTab ico="upload.svg">
              <PlaylistManipulator
                clipboard={clipboard}
                setClipboard={setClipboard}
                data={data}
                setData={setData}
              />
            </SidebarTab>
          </SidebarTabs>
        </div>
        <div className="main--workspace">
          <Tabs>
            <div className="Filter">
              <SongDisplay 
                data={data}
                setSelectedSong={setSongSelection}
                grouping={outFilteredSongList}

                addToClipboard={addItemToClipboard}
                delFromClipboard={removeItemFromClipboard}
                clipboardColl={clipboard.set}
              />
            </div>
            <div className="Workspace">
              <SongDisplay
                data={data}
                setSelectedSong={setSongSelection}
                grouping={current_list}

                addToClipboard={addItemToClipboard}
                delFromClipboard={removeItemFromClipboard}
                clipboardColl={clipboard.set}

                dragAndDrop={{handleDrag: handleDrag, handleDrop: handleDrop}}
              />
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}