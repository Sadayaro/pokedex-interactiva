import React from 'react'
import '../styles/ModelPanel.css'

function ModelPanel({ modelStatus, onClose }) {
  return (
    <div className="model-panel-overlay" onClick={onClose}>
      <div className="model-panel" onClick={e => e.stopPropagation()}>
        <div className="model-panel-header">
          <h3>🔧 Estado del Modelo</h3>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>
        
        <div className="model-status-content">
          <div className="status-item">
            <span className="status-dot mobilenet"></span>
            <span>MobileNet:</span>
            <span className={modelStatus.mobilenet ? 'ready' : 'not-ready'}>
              {modelStatus.mobilenet ? '✅ Listo' : '⏳ Cargando...'}
            </span>
          </div>
          
          <div className="status-item">
            <span className="status-dot cnn"></span>
            <span>Modelo CNN:</span>
            <span className={modelStatus.pokemon ? 'ready' : 'not-ready'}>
              {modelStatus.pokemon ? '✅ Entrenado' : '❌ No disponible'}
            </span>
          </div>
          
          <div className="accuracy-info">
            <p>Precisión esperada: {modelStatus.pokemon ? '85-95%' : '60-70%'}</p>
          </div>
          
          <div className="training-steps">
            <h4>Entrenamiento:</h4>
            <ol>
              <li>Descargar imágenes de los 151 Pokémon</li>
              <li>Entrenar modelo CNN con TensorFlow</li>
              <li>Convertir a formato TensorFlow.js</li>
              <li>Subir a GitHub para deploy</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelPanel
