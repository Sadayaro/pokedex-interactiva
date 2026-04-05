import React from 'react'
import '../styles/PokedexLeft.css'

function PokedexLeft({ videoRef, isScanning, status, onScan, onToggleCamera, onShowModelPanel }) {
  return (
    <div className="pokedex-left">
      <div className="pokedex-header">
        <div className="main-light"></div>
        <div className="small-light red"></div>
        <div className="small-light yellow"></div>
        <div className="small-light green"></div>
      </div>
      
      <div className="screen-container">
        <div className="screen-header">
          <div className="power-led"></div>
          <div className="camera-icon">📷</div>
        </div>
        
        <div className="main-screen">
          <video 
            ref={videoRef}
            id="camera"
            autoPlay 
            playsInline
            muted
          />
          <div 
            id="scanning-effect" 
            className="scanning-line"
            style={{ display: isScanning ? 'block' : 'none' }}
          />
        </div>
        
        <div className="screen-footer">
          <div className="speaker-light"></div>
          <div className="speaker-grill">
            {[1,2,3].map(i => <div key={i} />)}
          </div>
        </div>
      </div>
      
      <div className="controls-left">
        <div className="d-pad">
          <button className="d-up">▲</button>
          <button className="d-left">◀</button>
          <button className="d-center">●</button>
          <button className="d-right">▶</button>
          <button className="d-down">▼</button>
        </div>
        
        <div className="action-buttons">
          <button onClick={onToggleCamera} className="btn-blue">
            CÁMARA
          </button>
          <button 
            onClick={onScan} 
            className="btn-red"
            disabled={isScanning}
          >
            {isScanning ? '...' : 'SCAN'}
          </button>
        </div>
        
        <div className="green-screen">
          <p>{status}</p>
        </div>
        
        <button onClick={onShowModelPanel} className="btn-model-status">
          🔧 Estado del Modelo
        </button>
      </div>
    </div>
  )
}

export default PokedexLeft
