import axios from "axios"
import { HelpDialog } from "../../dialogs/HelpDialog/HelpDialog"
import DialogContext from "../../utils/dialog"
import './Navbar.scss'

/**
 * Komponent renderujący pasek nawigacji na górze ekranu
 */
export default function Navbar(
  {setToken} : {setToken: (token: string | undefined) => void}
) {
  const logoutMethod = async () => {
    // await fetch('/api/auth/logout')
    setToken(undefined)
  }

  return (
    <div className="navbar">
      <div className="navbar--help">
        {/*<button onClick={() => {DialogContext.show(<HelpDialog />)}}>Pomoc</button>*/}
      </div>
      <div className="navbar--separator">

      </div>
      <div className="navbar--logout">
        <button onClick={logoutMethod}>
          Log out
        </button>
      </div>
    </div>
  )
}