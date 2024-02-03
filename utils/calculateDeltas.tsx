import { ReorderDTO } from "../dto/reorder.dto";

// algorytm obliczający potrzebne akcje żeby zmienić kolejność piosenek w docelowy
export function calculateDeltas(dest: string[], origin: string[]): ReorderDTO[] {
  const cpy = [...origin]

  const operations: ReorderDTO[] = []

  for(let i = 0; i < dest.length; i++) {
    // znajdowanie mismatchy
    if(dest[i] != cpy[i]) {
      let j = i + 1;
      // znajdowanie miejsca gdzie szukana piosenka się znajduje
      for(; j < dest.length; j++) {
        if(dest[i] == cpy[j]) {
            break;
        }
      }

      let prefLen = 1;
      
      // sprawdzenia czy są inne piosenki w kolejnosci które też można przenieść na raz
      while(j + prefLen < cpy.length && dest[i + prefLen] == cpy[j + prefLen]) {
          prefLen++;
      }

      // zapisywanie operacji
      const cutout = cpy.splice(j, prefLen)
      cpy.splice(i, 0, ...cutout)

      operations.push({
        range_start: j,
        insert_before: i,
        range_length: prefLen
      })
    }
  }

  return operations
}
