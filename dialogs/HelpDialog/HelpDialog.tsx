import { useEffect, useState } from "react";
import DialogContext from "../../utils/dialog";
import { getUserProfile } from "../../utils/SpotifyRepository";

/**
 * Dialog używany przy debugowaniu aplikacji
 */
export function HelpDialog() {
  return (
    <div>
      
      <button onClick={() => DialogContext.close()}>OK</button>
    </div>
  )
}