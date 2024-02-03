import { Children, useState } from "react"
import './Tabs.scss'

/**
 * Komponent z przyciskiem wyboru zakładki
 */
export function TabButton({
  activeTab,
  label,
  onClick
}) {
  //const el = Children.only(children)

  return (
    <div onClick={onClick} className={activeTab ? "tab tab-active" : "tab"}>
      {label}
    </div>
  )
}

/**
 * Wrapper na zawartość zakładki
 */
export function TabContent(props: {
  children,
  isActive: boolean
}) {
  return (
    <div className={props.isActive ? "tab-content" : "tab-content-inactive" }>
      {props.children}
    </div>
  )
}

export function Tab({
  children,
  ico,
  name
}) {
  return children
}

/**
 * Komponent zarządzający zakładkami w głównym widoku
 */
export function Tabs({
  children,
}) {
  const dflTab = children[0]?.props.className

  const [activeTab, setActiveTab] = useState(dflTab)

  return (
    <div className="tabs">
      <div className="tab-nav">
        <ol className="tab-list">
          {children.map((child) => {
            const { className } = child.props;

            return (
              <li key={className}>
                <TabButton 
                  activeTab={className === activeTab}
                  label={className}
                  onClick={() => setActiveTab(child.props.className)}
                />
              </li>
            );
          })}
        </ol>
      </div>
      <div className="tabs__wrapper">
        {children.map((child) => {
          return (
            <TabContent key={child.props.className} isActive={child.props.className == activeTab}>
              {child.props.children}
            </TabContent>
          );
        })}
      </div>
    </div>
  );
}