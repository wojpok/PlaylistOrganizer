import React, { useState, useEffect, useMemo } from 'react';
import WebPlayback from '../WebPlayback/WebPlayback'
import Login from '../Login/Login'
import './App.scss';
import { Downloader } from '../Downloader/Downloader';
import { ScreenLock } from '../ScreenLock/ScreenLock';
import DialogContext from '../../utils/dialog';
/**
 * Główny komponent aplikacji, zajmuje się routingiem
 */
function App() {
  const [content, setContent] = useState<undefined | any>(undefined);
  const [screenLock, setScreenLock] = useState<boolean>(false);
  const [code, setCode] = useState<string | null | undefined>(null)

  useMemo(() => {
    DialogContext.setDialogContent = setContent;
    DialogContext.setDialogVisibility = setScreenLock;
  }, [setContent, setScreenLock])

  function getQueryVariable(variable: string) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    } 
    return null
  }

  // odbiór kodu z URL
  useEffect(()=> {
    const code = getQueryVariable('code');

    if(code) {
      window.history.pushState({}, document.title, "/");
      setCode(code)
    }
  }, [])

  return (
    <>
      <ScreenLock state={screenLock} children={content} />
      <div className="app__contener">
        <div className='app__workspace'>
          { (code === null || code === undefined) 
            ? <Login /> 
            // setToken pomimo mylnej nazwy jest używany do wymuszenia odświeżenia strony i wylogowania
            : <Downloader code={code} setToken={setCode}/> 
            /*<WebPlayback token={token} /> */ // Do dodania w przyszłości
          }
        </div>
      </div>
    </>
  );
}

export default App;
