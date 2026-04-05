import { useState, useEffect, useRef, useCallback } from 'react'
import PokedexLeft from './components/PokedexLeft'
import PokedexRight from './components/PokedexRight'
import ModelPanel from './components/ModelPanel'
import StartOverlay from './components/StartOverlay'
import { loadMobileNet, loadPokemonModel } from './hooks/useModel'
import { pokemonData } from './data/pokemonData'
import './styles/App.css'

function App() {
  const [isStarted, setIsStarted] = useState(false)
  const [currentPokemon, setCurrentPokemon] = useState(null)
  const [status, setStatus] = useState('Sistema listo')
  const [isScanning, setIsScanning] = useState(false)
  const [modelStatus, setModelStatus] = useState({
    mobilenet: false,
    pokemon: false,
    message: 'Cargando...'
  })
  const [showModelPanel, setShowModelPanel] = useState(false)
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const mobilenetModelRef = useRef(null)
  const pokemonModelRef = useRef(null)
  const streamRef = useRef(null)

  // Load models on mount
  useEffect(() => {
    const initModels = async () => {
      setStatus('Cargando modelos...')
      
      try {
        const mobilenet = await loadMobileNet()
        mobilenetModelRef.current = mobilenet
        
        const pokemon = await loadPokemonModel()
        pokemonModelRef.current = pokemon
        
        setModelStatus({
          mobilenet: !!mobilenet,
          pokemon: !!pokemon,
          message: pokemon ? 'Modelo CNN listo' : 'Usando MobileNet'
        })
        setStatus('Sistema listo')
      } catch (error) {
        console.error('Error loading models:', error)
        setStatus('Error al cargar modelos')
      }
    }
    
    initModels()
  }, [])

  // Start camera
  const startPokedex = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 },
        audio: false
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      streamRef.current = stream
      setIsStarted(true)
      
      // Welcome message
      const utterance = new SpeechSynthesisUtterance('Pokédex activada. Sistema listo para escanear Pokémon.')
      utterance.lang = 'es-ES'
      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Camera error:', error)
      alert('No se pudo acceder a la cámara')
    }
  }, [])

  // Scan Pokemon
  const scanPokemon = useCallback(async () => {
    if (!mobilenetModelRef.current || !videoRef.current) return
    
    setIsScanning(true)
    setStatus('Escaneando...')
    
    // Scanning effect
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    try {
      // Get random pokemon for demo (in real app, would use ML prediction)
      const randomId = Math.floor(Math.random() * 151) + 1
      const pokemon = pokemonData.find(p => p.id === randomId)
      
      if (pokemon) {
        setCurrentPokemon(pokemon)
        setStatus(`${pokemon.name} encontrado!`)
        
        // Speak result
        const utterance = new SpeechSynthesisUtterance(`¡${pokemon.name}! ${pokemon.description}`)
        utterance.lang = 'es-ES'
        speechSynthesis.speak(utterance)
      }
    } catch (error) {
      console.error('Scan error:', error)
      setStatus('Error en escaneo')
    } finally {
      setIsScanning(false)
    }
  }, [])

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.style.display = 
        videoRef.current.style.display === 'none' ? 'block' : 'none'
    }
  }, [])

  // Speak current pokemon
  const speakPokemon = useCallback(() => {
    if (currentPokemon) {
      const utterance = new SpeechSynthesisUtterance(
        `${currentPokemon.name}. ${currentPokemon.type}. ${currentPokemon.description}`
      )
      utterance.lang = 'es-ES'
      speechSynthesis.speak(utterance)
    }
  }, [currentPokemon])

  // Search by ID
  const searchById = useCallback((id) => {
    const pokemon = pokemonData.find(p => p.id === parseInt(id))
    if (pokemon) {
      setCurrentPokemon(pokemon)
      setStatus(`${pokemon.name} encontrado`)
    }
  }, [])

  return (
    <div className="app">
      {!isStarted && <StartOverlay onStart={startPokedex} />}
      
      <div className="pokedex-container">
        <PokedexLeft
          videoRef={videoRef}
          canvasRef={canvasRef}
          isScanning={isScanning}
          status={status}
          onScan={scanPokemon}
          onToggleCamera={toggleCamera}
          onShowModelPanel={() => setShowModelPanel(true)}
        />
        
        <div className="hinge">
          <div className="hinge-line"></div>
          <div className="hinge-line"></div>
        </div>
        
        <PokedexRight
          currentPokemon={currentPokemon}
          onSpeak={speakPokemon}
          onSearchById={searchById}
        />
      </div>
      
      {showModelPanel && (
        <ModelPanel
          modelStatus={modelStatus}
          onClose={() => setShowModelPanel(false)}
        />
      )}
    </div>
  )
}

export default App
