import './ClearButton.scss'

/**
 * Przycisk z ikonką reset.svg
 */
export default function ClearButton(
  props: {onClick: () => void}
) {
  return (
    <div className='clear-button' onClick={props.onClick}>
      <img className='clear-button__svg' src="reset.svg"/>
    </div>
  )
}