import { SongDTO } from "../dto/api/song.dto";
import { ClipboardDTO } from "../dto/clipboard.dto";
import { SongLUT } from "../dto/fastCollection.dto";

// metody usuwające i dodawające piosenki do obszaru roboczego
export default function clipboardFunctions(clipboard: ClipboardDTO, setClipboard: (clipboard: ClipboardDTO) => void) {
  const addItem = (song: SongLUT) => {
    clipboard.set.add(song.id)
    clipboard.order.push(song)
    setClipboard({...clipboard})
  };

  const removeItem = (song: SongLUT) => {
    if(clipboard.set.has(song.id)) {
      clipboard.set.delete(song.id);
      setClipboard({
        set: clipboard.set,
        order: clipboard.order.filter(e => e.id != song.id)
      })
    }
  }

  return [addItem, removeItem];
}
