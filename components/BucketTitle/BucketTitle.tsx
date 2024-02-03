import './BucketTitle.scss'

/**
 * Komponent z tytułem sekcji przy sortowaniu wyników
 */
export default function BucketTitle(props: {
  name: string | number
}) {
  return (
    <div className="bucket__wrapper">
      <div className='bucket'>
        {props.name}
      </div>
    </div>
  )
}