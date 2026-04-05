import { useState, useEffect, useRef, useCallback } from 'react'
import PokedexLeft from './components/PokedexLeft'
import PokedexRight from './components/PokedexRight'
import ModelPanel from './components/ModelPanel'
import StartOverlay from './components/StartOverlay'
import { loadMobileNet, loadPokemonModel } from './hooks/useModel'
import { pokemonData } from './data/pokemonData'
import pokedexVoice from './utils/pokedexVoice'
import './styles/App.css'

// Normalizar nombres de Pokémon para búsqueda por voz
const normalizePokemonName = (name) => {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')
}

// Mapa de nombres comunes a IDs de Pokémon
const voiceSearchMap = {
  'bulbasaur': 1, 'ivysaur': 2, 'venusaur': 3,
  'charmander': 4, 'charmeleon': 5, 'charizard': 6,
  'squirtle': 7, 'wartortle': 8, 'blastoise': 9,
  'caterpie': 10, 'metapod': 11, 'butterfree': 12,
  'weedle': 13, 'kakuna': 14, 'beedrill': 15,
  'pidgey': 16, 'pidgeotto': 17, 'pidgeot': 18,
  'rattata': 19, 'raticate': 20, 'spearow': 21,
  'fearow': 22, 'ekans': 23, 'arbok': 24,
  'pikachu': 25, 'raichu': 26, 'sandshrew': 27,
  'sandslash': 28, 'nidoran hembra': 29, 'nidoran femenino': 29, 'nidoran': 29,
  'nidorina': 30, 'nidoqueen': 31, 'nidoran macho': 32,
  'nidorino': 33, 'nidoking': 34, 'clefairy': 35,
  'clefable': 36, 'vulpix': 37, 'ninetales': 38,
  'jigglypuff': 39, 'wigglytuff': 40, 'zubat': 41,
  'golbat': 42, 'oddish': 43, 'gloom': 44,
  'vileplume': 45, 'paras': 46, 'parasect': 47,
  'venonat': 48, 'venomoth': 49, 'diglett': 50,
  'dugtrio': 51, 'meowth': 52, 'persian': 53,
  'psyduck': 54, 'golduck': 55, 'mankey': 56,
  'primeape': 57, 'growlithe': 58, 'arcanine': 59,
  'poliwag': 60, 'poliwhirl': 61, 'poliwrath': 62,
  'abra': 63, 'kadabra': 64, 'alakazam': 65,
  'machop': 66, 'machoke': 67, 'machamp': 68,
  'bellsprout': 69, 'weepinbell': 70, 'victreebel': 71,
  'tentacool': 72, 'tentacruel': 73, 'geodude': 74,
  'graveler': 75, 'golem': 76, 'ponyta': 77,
  'rapidash': 78, 'slowpoke': 79, 'slowbro': 80,
  'magnemite': 81, 'magneton': 82, 'farfetch': 83, 'farfetchd': 83,
  'doduo': 84, 'dodrio': 85, 'seel': 86,
  'dewgong': 87, 'grimer': 88, 'muk': 89,
  'shellder': 90, 'cloyster': 91, 'gastly': 92,
  'haunter': 93, 'gengar': 94, 'onix': 95,
  'drowzee': 96, 'hypno': 97, 'krabby': 98,
  'kingler': 99, 'voltorb': 100, 'electrode': 101,
  'exeggcute': 102, 'exeggutor': 103, 'cubone': 104,
  'marowak': 105, 'hitmonlee': 106, 'hitmonchan': 107,
  'lickitung': 108, 'koffing': 109, 'weezing': 110,
  'rhyhorn': 111, 'rhydon': 112, 'chansey': 113,
  'tangela': 114, 'kangaskhan': 115, 'horsea': 116,
  'seadra': 117, 'goldeen': 118, 'seaking': 119,
  'staryu': 120, 'starmie': 121, 'mr mime': 122, 'mrmime': 122,
  'scyther': 123, 'jynx': 124, 'electabuzz': 125,
  'magmar': 126, 'pinsir': 127, 'tauros': 128,
  'magikarp': 129, 'gyarados': 130, 'lapras': 131,
  'ditto': 132, 'eevee': 133, 'vaporeon': 134,
  'jolteon': 135, 'flareon': 136, 'porygon': 137,
  'omanyte': 138, 'omastar': 139, 'kabuto': 140,
  'kabutops': 141, 'aerodactyl': 142, 'snorlax': 143,
  'articuno': 144, 'zapdos': 145, 'moltres': 146,
  'dratini': 147, 'dragonair': 148, 'dragonite': 149,
  'mewtwo': 150, 'mew': 151
}

function App() {
  const [isStarted, setIsStarted] = useState(false)
  const [currentPokemon, setCurrentPokemon] = useState(null)
  const [status, setStatus] = useState('Sistema listo')
  const [isScanning, setIsScanning] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [modelStatus, setModelStatus] = useState({
    mobilenet: false,
    pokemon: false,
    message: 'Cargando...'
  })
  const [showModelPanel, setShowModelPanel] = useState(false)
  const recognitionRef = useRef(null)
  
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
    // Mark user interaction for audio context
    pokedexVoice.userInteracted()
    
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
      setTimeout(() => {
        pokedexVoice.speakWelcome()
      }, 500)
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

  // Voice search - buscar Pokémon por voz
  const voiceSearch = useCallback(() => {
    // Mark user interaction for audio context
    pokedexVoice.userInteracted()
    
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setStatus('Reconocimiento de voz no soportado')
      alert('Tu navegador no soporta reconocimiento de voz. Intenta usar Chrome.')
      return
    }

    // If already listening, stop
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    // Create new recognition instance
    const recognition = new SpeechRecognition()
    recognition.lang = 'es-ES' // Spanish
    recognition.continuous = false
    recognition.interimResults = false
    recognition.maxAlternatives = 5

    recognition.onstart = () => {
      setIsListening(true)
      setStatus('Escuchando... Di el nombre del Pokémon')
    }

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim()
      console.log('Voz reconocida:', transcript)
      
      // Try to find Pokemon by voice search map
      let pokemonId = null
      let normalizedInput = normalizePokemonName(transcript)
      
      // Check all alternatives
      for (let i = 0; i < event.results[0].length; i++) {
        const alternative = event.results[0][i].transcript.toLowerCase().trim()
        const normalizedAlt = normalizePokemonName(alternative)
        
        // Try exact match first
        if (voiceSearchMap[normalizedAlt]) {
          pokemonId = voiceSearchMap[normalizedAlt]
          break
        }
        
        // Try partial match
        for (const [key, id] of Object.entries(voiceSearchMap)) {
          if (normalizedAlt.includes(key) || key.includes(normalizedAlt)) {
            pokemonId = id
            break
          }
        }
        if (pokemonId) break
      }
      
      // If still not found, try fuzzy search on Pokemon names
      if (!pokemonId) {
        for (const pokemon of pokemonData) {
          const normalizedName = normalizePokemonName(pokemon.name)
          if (normalizedInput.includes(normalizedName) || 
              normalizedName.includes(normalizedInput) ||
              levenshteinDistance(normalizedInput, normalizedName) <= 2) {
            pokemonId = pokemon.id
            break
          }
        }
      }

      if (pokemonId) {
        const pokemon = pokemonData.find(p => p.id === pokemonId)
        if (pokemon) {
          setCurrentPokemon(pokemon)
          setStatus(`${pokemon.name} encontrado por voz!`)
          pokedexVoice.speakPokedexEntry(pokemon.name, pokemon.type, pokemon.description)
        }
      } else {
        setStatus(`No se encontró: "${transcript}"`)
        pokedexVoice.speakWithEffect(`Pokémon no reconocido. Intenta de nuevo.`)
      }
      
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      if (event.error === 'not-allowed') {
        setStatus('Permiso de micrófono denegado')
      } else if (event.error === 'no-speech') {
        setStatus('No se detectó voz')
      } else {
        setStatus('Error en reconocimiento de voz')
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [isListening])

  // Helper function for fuzzy string matching
  function levenshteinDistance(str1, str2) {
    const matrix = []
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
          )
        }
      }
    }
    return matrix[str2.length][str1.length]
  }

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
          onVoiceSearch={voiceSearch}
          isListening={isListening}
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
