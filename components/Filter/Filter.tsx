import React, { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FilterDTO, defaultFilter } from '../../dto/searchCriteria.dto';
import { useDebouncedCallback } from 'use-debounce';
import './Filter.scss';
import ClearButton from '../ClearButton/ClearButton';

/**
 * Nieużywany komponent.
 * Miał obsługiwać input listowy
 */
function ParameterList(props: {
  addParameter: (param: string) => void,
  deleteParameter: (id: number) => void,
  parameters: string[],
  disabled?: boolean,
}) {
  const [newParameter, setNewParameter] = useState<string>('');

  return (
    <div>
      <ul>
        {props.parameters.map((parameter, index) => (
          <li key={index}>
            {parameter}
            <button onClick={() => props.deleteParameter(index)} disabled={props.disabled}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <input
          disabled={props.disabled}
          type="text"
          value={newParameter}
          onChange={(e) => setNewParameter(e.target.value)}
        />
        <button disabled={props.disabled} onClick={() => {
          props.addParameter(newParameter);
          setNewParameter('');
        }}>Add Parameter</button>
      </div>
    </div>
  );
};

/**
 * Wrapper na klasę Slider z pakietu rc-slider
 */
function SlideBar(props: {
  name: string,
  param: [number, number],
  setParam: (val: [number, number]) => void,
  disabled?: boolean,
}) {
  return (
    <div>
      <div>{props.name}</div>
      <div className='slidebar__wrapper'>
        <div className='slidebar__boundary'>{props.param[0]}</div>
        <div className='slidebar__slidear'>
          <Slider range 
            defaultValue={[0, 10]}
            value={props.param}
            pushable={1}
            step={1}
            min={0}
            max={10}
            //  @ts-ignore
            onChange={props.setParam}
            disabled={props.disabled}
          />
        </div>
        <div className='slidebar__boundary'>{props.param[1]}</div>
      </div>
    </div>
  )
}

/**
 * Komponent pozwalający modyfikować parametry filtra
 */
export function FilterInput(props: {
  filter: FilterDTO,
  setFilter: ((filter: FilterDTO) => void),
  frozen?: boolean,
}) {
  const [value, setValue] = useState(props.filter)
  const setParentValue = useDebouncedCallback(props.setFilter, 1000)

  const updateParent = (value: FilterDTO) => {
    setValue(value)
    setParentValue(value)
  }
  
  const propSetter = (prop: string) => (nValue: any) => { 
    const nFilter: FilterDTO = {...value}
    // @ts-ignore
    nFilter[prop] = nValue
    updateParent(nFilter) 
  }

  return (
    <div className='sidebar-tab__section'>
      <div className='filter__header'>
        <h2>Filter by parameters</h2>
        <ClearButton onClick={() => updateParent(defaultFilter)}/>
      </div>
      <div>
        Mode:
        <div style={{display: 'flex'}}>
          <div>
            <input type='checkbox' checked={value.minor} onChange={e => propSetter('minor')(e.target.checked)} disabled={props.frozen}></input>
            Minor
          </div>
          <div>
            <input type='checkbox' checked={value.major} onChange={e => propSetter('major')(e.target.checked)} disabled={props.frozen}></input>
            Major
          </div>
        </div>
      </div>
      <SlideBar 
        name="Popularity"
        param={value.popularity}
        setParam={propSetter('popularity')}
        disabled={props.frozen}
      />
      <SlideBar 
        name="Danceability"
        param={value.danceability}
        setParam={propSetter('danceability')}
        disabled={props.frozen}
      />
      <SlideBar 
        name="Energy"
        param={value.energy}
        setParam={propSetter('energy')}
        disabled={props.frozen}
      />
      <SlideBar 
        name="Speechiness"
        param={value.speechiness}
        setParam={propSetter('speechiness')}
        disabled={props.frozen}
      />
      <SlideBar 
        name="Acousticness"
        param={value.acousticness}
        setParam={propSetter('acousticness')}
        disabled={props.frozen}
      />
      <SlideBar 
        name="Valence"
        param={value.valence}
        setParam={propSetter('valence')}
        disabled={props.frozen}
      />
      <SlideBar 
        name="Instrumentalness"
        param={value.instrumentalness}
        setParam={propSetter('instrumentalness')}
        disabled={props.frozen}
      />
    </div>
  )
}