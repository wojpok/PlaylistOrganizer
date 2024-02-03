import React, { Children, useState } from "react";

import './SidebarTabs.scss'

/**
 * Przycisk zmieniający panel w pasku bocznym
 */
function SidebarButton(props: {
  isActive: boolean,
  onClick: () => void,
  ico?: string
}) {

  return (
    <div className={"sidebar-button" + (props.isActive ? " activated": "")} onClick={props.onClick}>
      {
        props.ico 
        ? props.isActive 
          ? <img className="sidebar-button__img" src={props.ico} /> 
          : <img className="sidebar-button__img--inactive" src={props.ico} />
        : props.isActive 
          ? ">" 
          : '<'
        }
    </div>
  )
}

/**
 * Wrapper na panel w pasku bocznym
 */
export function SidebarTab({
  children,
  ico
}) {

  return <div className="sidebar--entry">{children}</div>
}


/**
 * Komponent zarządzający paskiem bocznym
 */
export default function SidebarTabs(props: {
  children: any
}) {
  const [active, setActive] = useState<null | number>(props.children.length ? 0 : null);
  const buttonData = Array(props.children.length).fill(0).map((_, index) => index)

  return (
    <>
      <div className="sidebar-content__wrapper">
        <div className="sidebar-content__buttons">
          {buttonData.map((el, i) => {
            return <SidebarButton 
            
              key={el} 
              ico={props.children[i].props.ico ?? undefined}
              isActive={el === active} 
              onClick={el === active ? () => setActive(null) : () => setActive(el)} 
            />
          })}
        </div>
        <div className="sidebar-content__contener">
          <div className="sidebar-content">
            {buttonData.map(el => {
              //if (el === active) {
                return (
                  <div key={el} style={el === active ? {} : {display: 'none'}}>
                    {props.children[el]}
                  </div>
                )
              //}
            })}
          </div>
        </div>
      </div>
    </>
  )
}