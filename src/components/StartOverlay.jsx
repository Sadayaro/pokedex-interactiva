import React from 'react'
import '../styles/StartOverlay.css'

function StartOverlay({ onStart }) {
  return (
    <div className="start-overlay">
      <div className="start-content">
        <h1>POKÉDEX INTERACTIVA</h1>
        <p>Reconocimiento visual de Pokémon con IA</p>
        <button onClick={onStart} className="btn-start">
          INICIAR POKÉDEX
        </button>
        <div className="instructions">
          <p>✓ Necesitarás permitir acceso a la cámara</p>
          <p>✓ Usa el botón SCAN para identificar Pokémon</p>
          <p>✓ Apunta a una figura de Pokémon o imagen</p>
        </div>
      </div>
    </div>
  )
}

export default StartOverlay
