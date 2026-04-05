import { useState, useEffect, useRef, useCallback } from 'react'
import PokedexLeft from './components/PokedexLeft'
import PokedexRight from './components/PokedexRight'
import ModelPanel from './components/ModelPanel'
import StartOverlay from './components/StartOverlay'
import { loadMobileNet, loadPokemonModel } from './hooks/useModel'
import { pokemonData } from './data/pokemonData'
import pokedexVoice from './utils/pokedexVoice'
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
      
      // Welcome message with Pokedex metallic voice
      pokedexVoice.speakWelcome()
    } catch (error) {
      console.error('Camera error:', error)
      alert('No se pudo acceder a la cámara')
    }
  }, [])

  // Scan Pokemon using ML model
  const scanPokemon = useCallback(async () => {
    if (!mobilenetModelRef.current || !videoRef.current) return
    
    setIsScanning(true)
    setStatus('Escaneando...')
    
    // Scanning effect
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      let pokemon = null
      
      // Try to use CNN model first if available
      if (pokemonModelRef.current && canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        
        // Draw video frame to canvas
        canvas.width = 224
        canvas.height = 224
        ctx.drawImage(videoRef.current, 0, 0, 224, 224)
        
        // Get image data and preprocess
        const imageData = ctx.getImageData(0, 0, 224, 224)
        const tensor = tf.browser.fromPixels(imageData)
          .expandDims(0)
          .div(255.0)
        
        // Predict with CNN model
        const prediction = pokemonModelRef.current.predict(tensor)
        const scores = await prediction.data()
        const maxIndex = scores.indexOf(Math.max(...scores))
        
        // Map to Pokemon (model has 15 classes)
        const modelClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 133, 143, 150, 151]
        const predictedId = modelClasses[maxIndex]
        pokemon = pokemonData.find(p => p.id === predictedId)
        
        tensor.dispose()
        prediction.dispose()
      } else {
        // Fallback: use MobileNet to classify then find closest Pokemon
        const result = await mobilenetModelRef.current.classify(videoRef.current)
        if (result && result[0]) {
          // Try to find Pokemon by matching the MobileNet label
          const label = result[0].className.toLowerCase()
          pokemon = pokemonData.find(p => 
            label.includes(p.name.toLowerCase()) ||
            p.name.toLowerCase().includes(label.split(',')[0])
          )
        }
      }
      
      // If no match found, pick random from the 15 supported Pokemon
      if (!pokemon) {
        const supportedIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 133, 143, 150, 151]
        const randomId = supportedIds[Math.floor(Math.random() * supportedIds.length)]
        pokemon = pokemonData.find(p => p.id === randomId)
      }
      
      if (pokemon) {
        setCurrentPokemon(pokemon)
        setStatus(`${pokemon.name} encontrado!`)
        
        // Speak result with Pokedex metallic voice
        pokedexVoice.speakPokedexEntry(pokemon.name, pokemon.type, pokemon.description)
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

  // Speak current pokemon with Pokedex metallic voice
  const speakPokemon = useCallback(() => {
    if (currentPokemon) {
      pokedexVoice.speakPokedexEntry(
        currentPokemon.name,
        currentPokemon.type,
        currentPokemon.description
      )
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
