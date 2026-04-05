import React, { useState } from 'react'
import { pokemonData } from '../data/pokemonData'
import '../styles/PokedexRight.css'

function PokedexRight({ currentPokemon, onSpeak, onSearchById }) {
  const [numpadInput, setNumpadInput] = useState('')

  const handleNumpad = (key) => {
    if (key === 'CLR') {
      setNumpadInput('')
    } else if (key === 'GO') {
      if (numpadInput) {
        onSearchById(numpadInput)
        setNumpadInput('')
      }
    } else if (numpadInput.length < 3) {
      setNumpadInput(prev => prev + key)
    }
  }

  return (
    <div className="pokedex-right">
      <div className="info-screen">
        {currentPokemon ? (
          <>
            <h2>{currentPokemon.name} #{currentPokemon.id}</h2>
            <div className="pokemon-image-container">
              <img 
                src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(currentPokemon.id).padStart(3, '0')}.png`}
                alt={currentPokemon.name}
                className="pokemon-image"
              />
            </div>
            <div className="info-content">
              <div className="detail-row">
                <span className="label">Tipo:</span>
                <span className="value type-badge">{currentPokemon.type}</span>
              </div>
              <div className="detail-row">
                <span className="label">Altura:</span>
                <span className="value">{currentPokemon.height}</span>
              </div>
              <div className="detail-row">
                <span className="label">Peso:</span>
                <span className="value">{currentPokemon.weight}</span>
              </div>
              <div className="detail-row">
                <span className="label">Habilidad:</span>
                <span className="value">{currentPokemon.ability}</span>
              </div>
              <p className="description">{currentPokemon.description}</p>
            </div>
          </>
        ) : (
          <>
            <h2>Esperando...</h2>
            <p className="instruction">Apunta la cámara a un Pokémon y presiona SCAN</p>
          </>
        )}
      </div>
      
      <div className="numpad-container">
        <div className="numpad-display">
          <span>#{numpadInput || '???'}</span>
        </div>
        <div className="numpad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button key={num} onClick={() => handleNumpad(num.toString())}>
              {num}
            </button>
          ))}
          <button onClick={() => handleNumpad('CLR')}>CLR</button>
          <button onClick={() => handleNumpad('0')}>0</button>
          <button onClick={() => handleNumpad('GO')} className="go-btn">GO</button>
        </div>
      </div>
      
      <div className="right-controls">
        <button onClick={onSpeak} className="btn-black">🔊 INFO</button>
        <button onClick={() => onSearchById(Math.floor(Math.random() * 151) + 1)} className="btn-black">
          🎲 RANDOM
        </button>
      </div>
    </div>
  )
}

export default PokedexRight
