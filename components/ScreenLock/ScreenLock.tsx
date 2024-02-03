import React from "react"
import './ScreenLock.scss'

/**
 * Komponent wyświetlający okienka dialogowe w aplikacji
 */
export function ScreenLock(props: { 
    state: boolean
    children?: React.ReactNode | undefined
}) {
  return (
    <>
      <div className="screen-lock" style={{ visibility: (props.state ? 'visible' : 'hidden') }}>
        <div className="screen-lock-content">
          {props.children ?? <h1>Screen is locked!</h1>}
        </div>        
      </div>
    </>
  )
}