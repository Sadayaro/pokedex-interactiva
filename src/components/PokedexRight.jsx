import React, { useState } from 'react'
import { pokemonData } from '../data/pokemonData'
import '../styles/PokedexRight.css'

const TYPES = [
  { id: 'all', name: 'TODOS', color: '#8e8e8e' },
  { id: 'fire', name: 'FUEGO', color: '#f08030' },
  { id: 'water', name: 'AGUA', color: '#6890f0' },
  { id: 'grass', name: 'PLANTA', color: '#78c850' },
  { id: 'electric', name: 'ELÉCTRICO', color: '#f8d030' },
  { id: 'psychic', name: 'PSÍQUICO', color: '#f85888' },
  { id: 'ice', name: 'HIELO', color: '#98d8d8' },
  { id: 'dragon', name: 'DRAGÓN', color: '#7038f8' },
  { id: 'dark', name: 'SINIESTRO', color: '#705848' },
  { id: 'fairy', name: 'HADA', color: '#ee99ac' }
]

function PokedexRight({ currentPokemon, onSpeak, onSearchById, onVoiceSearch, isListening }) {
  const [numpadInput, setNumpadInput] = useState('')
  const [selectedType, setSelectedType] = useState('all')

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

  const handleTypeFilter = (typeId) => {
    setSelectedType(typeId)
    if (typeId !== 'all') {
      const filtered = pokemonData.filter(p => 
        p.type.toLowerCase().includes(typeId)
      )
      if (filtered.length > 0) {
        const random = filtered[Math.floor(Math.random() * filtered.length)]
        onSearchById(random.id)
      }
    }
  }

  return (
    <div className="pokedex-right">
      <div className="display-screen">
        {currentPokemon ? (
          <>
            <h2 className="pokemon-name">{currentPokemon.name} #{String(currentPokemon.id).padStart(3, '0')}</h2>
            <div className="pokemon-image-container">
              <img 
                src={`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${String(currentPokemon.id).padStart(3, '0')}.png`}
                alt={currentPokemon.name}
                className="pokemon-image"
              />
            </div>
            <div className="pokemon-info">
              <div className="info-row">
                <span className="info-label">Tipo:</span>
                <span className="type-badge" style={{ backgroundColor: getTypeColor(currentPokemon.type) }}>
                  {currentPokemon.type}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Altura:</span>
                <span>{currentPokemon.height}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Peso:</span>
                <span>{currentPokemon.weight}</span>
              </div>
              {currentPokemon.category && (
                <div className="info-row">
                  <span className="info-label">Categoría:</span>
                  <span>{currentPokemon.category}</span>
                </div>
              )}
              {currentPokemon.habitat && (
                <div className="info-row">
                  <span className="info-label">Hábitat:</span>
                  <span>{currentPokemon.habitat}</span>
                </div>
              )}
              {currentPokemon.weaknesses && (
                <div className="info-row">
                  <span className="info-label">Debilidades:</span>
                  <span>{currentPokemon.weaknesses}</span>
                </div>
              )}
              <p className="pokemon-description">{currentPokemon.description}</p>
            </div>
          </>
        ) : (
          <>
            <h2 className="waiting-text">ESPERANDO...</h2>
            <p className="instruction-text">Apunta la cámara a un Pokémon y presiona SCAN</p>
          </>
        )}
      </div>

      <div className="type-filters">
        {TYPES.map(type => (
          <button
            key={type.id}
            className={`type-btn ${selectedType === type.id ? 'active' : ''}`}
            style={{ backgroundColor: type.color }}
            onClick={() => handleTypeFilter(type.id)}
          >
            {type.name}
          </button>
        ))}
      </div>

      <div className="control-buttons">
        <button onClick={() => {}} className="info-btn">INFO</button>
        <button onClick={onSpeak} className="voice-btn">
          VOZ 🔊
        </button>
        <button 
          onClick={onVoiceSearch} 
          className={`voice-search-btn ${isListening ? 'listening' : ''}`}
          title="Buscar por voz"
        >
          {isListening ? '🎤 Escuchando...' : '🎤 VOZ'}
        </button>
      </div>

      <div className="numpad-section">
        <div className="numpad-display">#{numpadInput || '???'}</div>
        <div className="numpad-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button 
              key={num} 
              className="numpad-btn"
              onClick={() => handleNumpad(num.toString())}
            >
              {num}
            </button>
          ))}
          <button className="numpad-btn" onClick={() => handleNumpad('CLR')}>CLR</button>
          <button className="numpad-btn" onClick={() => handleNumpad('0')}>0</button>
          <button className="numpad-btn go" onClick={() => handleNumpad('GO')}>GO</button>
        </div>
      </div>
    </div>
  )
}

function getTypeColor(type) {
  const colors = {
    'Planta': '#78c850',
    'Fuego': '#f08030',
    'Agua': '#6890f0',
    'Eléctrico': '#f8d030',
    'Veneno': '#a040a0',
    'Normal': '#a8a878',
    'Psíquico': '#f85888',
    'Hielo': '#98d8d8',
    'Tierra': '#e0c068',
    'Volador': '#a890f0',
    'Lucha': '#c03028',
    'Roca': '#b8a038',
    'Bicho': '#a8b820',
    'Fantasma': '#705898',
    'Dragón': '#7038f8',
    'Siniestro': '#705848',
    'Acero': '#b8b8d0',
    'Hada': '#ee99ac'
  }
  return colors[type] || '#8e8e8e'
}

export default PokedexRight
