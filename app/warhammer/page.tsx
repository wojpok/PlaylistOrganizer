"use client"

import { useState } from 'react';
import './page.scss'
import HistoryEntry from '@/components/HistoryEntry/HistoryEntry';

export default function HistoryGenerator() {
  const [rand1, setRand1] = useState(0)
  const [rand2, setRand2] = useState(0)

  return (
    <div className="warhammer-main">
      

      <h3>
        History Generator
      </h3>

      <button onClick={e => setRand2(rand2 + 1)}> {"Get Next >"} </button>
      <div></div>
      { rand2 === 0 ? " " : <HistoryEntry seq={rand2}/> }
    </div>
  )
}

/*
<h3>
        Character Generator
      </h3>

      <button onClick={e => setRand1(rand1 + 1)}> {"Get Next >"} </button>
      <div></div>
      { rand1 === 0 ? " " : <HistoryEntry seq={rand1}/> }}
*/

