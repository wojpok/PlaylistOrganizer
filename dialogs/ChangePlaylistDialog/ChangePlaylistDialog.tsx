
export const pickOriginal = 'original'
export const pickMerge = 'merge'
export const pickExisting = 'existing'

/**
 * Dialog z wyborem akcji po zmianie playlisty
 */
export function ChangePlaylistDialog(props: {
  setDecision: (string) => void
}) {
  return (
    <div>
      <h3>
        What would you like to do?
      </h3>
      <div style={{display: 'flex', justifyContent: 'space-around'}}>
        <div>
          <button onClick={() => props.setDecision(pickOriginal)}>
            Use original playlist
          </button>
        </div>
        <div>
          <button onClick={() => props.setDecision(pickMerge)}>
            Merge playlists
          </button>
        </div>
        <div>
          <button onClick={() => props.setDecision(pickExisting)}>
            Use existing selection
          </button>
        </div>
      </div>
    </div>
  )
}