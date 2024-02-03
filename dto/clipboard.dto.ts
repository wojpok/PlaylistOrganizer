import { z } from 'zod'
import { SongParser } from './api/song.dto';
import { SongLUT } from './fastCollection.dto';

export interface ClipboardDTO {
  order: SongLUT[],
  set: Set<string>
}
