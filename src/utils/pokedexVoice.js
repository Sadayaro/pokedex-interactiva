// Pokedex Voice Effect Utility using Web Audio API
// Creates metallic/robotic voice effect similar to the original Pokedex

class PokedexVoice {
  constructor() {
    this.audioContext = null
    this.isInitialized = false
    this.hasUserInteracted = false
  }

  init() {
    if (!this.isInitialized) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.isInitialized = true
      } catch (e) {
        console.error('AudioContext init failed:', e)
      }
    }
    // Resume AudioContext if suspended (browser policy)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume()
    }
  }

  // Mark that user has interacted (required for audio)
  userInteracted() {
    this.hasUserInteracted = true
    this.init()
  }

  // Apply metallic/robotic effect to speech
  speakWithEffect(text, onComplete = null) {
    // Ensure AudioContext is ready
    this.init()
    
    // Check if speech synthesis is available
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported')
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()
    
    // First, use speech synthesis to generate audio
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 1.0
    utterance.pitch = 0.85
    utterance.volume = 1
    
    // Get robotic voice - wait for voices to load
    const getVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      const roboticVoice = voices.find(v => 
        v.name.includes('Google español') || 
        v.name.includes('Diego') || 
        v.name.includes('Carlos') ||
        v.name.includes('Microsoft Pablo') ||
        v.name.includes('Roberto') ||
        v.name.includes('Jorge') ||
        v.name.includes('Juan') ||
        v.name.includes('Spanish') ||
        v.name.includes('Español')
      )
      if (roboticVoice) {
        utterance.voice = roboticVoice
        console.log('Using voice:', roboticVoice.name)
      } else {
        console.log('No robotic voice found, using default')
      }
    }

    // Load voices
    if (window.speechSynthesis.getVoices().length > 0) {
      getVoices()
    } else {
      window.speechSynthesis.onvoiceschanged = getVoices
    }

    // Speak with processing
    this.processAndSpeak(utterance, onComplete)
  }

  processAndSpeak(utterance, onComplete) {
    // Play start beep
    this.playBeep(880, 0.1, 0.1)
    
    // Speak
    window.speechSynthesis.speak(utterance)
    
    utterance.onend = () => {
      // Play end beep
      this.playBeep(660, 0.1, 0.05)
      if (onComplete) onComplete()
    }
    
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e)
    }
  }

  // Generate metallic beep sound
  playBeep(frequency = 880, duration = 0.1, volume = 0.1) {
    if (!this.audioContext) {
      this.init()
    }
    
    if (!this.audioContext) {
      console.error('AudioContext not available')
      return
    }
    
    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      const filter = this.audioContext.createBiquadFilter()
      
      // Saw wave for metallic sound
      oscillator.type = 'sawtooth'
      oscillator.frequency.value = frequency
      
      // Low pass filter to smooth the saw wave
      filter.type = 'lowpass'
      filter.frequency.value = 2000
      
      // Gain envelope
      gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration)
      
      // Connect nodes
      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(this.audioContext.destination)
      
      // Play
      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + duration)
    } catch (e) {
      console.error('Beep playback failed:', e)
    }
  }

  // Enhanced metallic voice with word-by-word processing
  speakPokedexEntry(pokemon, type, description) {
    const text = `Pokédex. Entrada. ${pokemon}. Tipo. ${type}. ${description}`
    
    // Add processing beeps between sections
    this.speakWithEffect(text)
    
    // Add mechanical reverb effect with multiple short beeps
    setTimeout(() => this.playBeep(1100, 0.05, 0.05), 300)
    setTimeout(() => this.playBeep(880, 0.05, 0.03), 600)
  }

  // Welcome message with scanning effect
  speakWelcome() {
    const text = 'Pokédex. Sistema activado. Iniciando base de datos. Listo para escanear.'
    this.speakWithEffect(text)
    
    // Startup sound sequence
    setTimeout(() => this.playBeep(523, 0.1, 0.1), 100)
    setTimeout(() => this.playBeep(659, 0.1, 0.1), 200)
    setTimeout(() => this.playBeep(880, 0.15, 0.15), 300)
  }
}

export const pokedexVoice = new PokedexVoice()
export default pokedexVoice
