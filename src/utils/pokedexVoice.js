// Pokedex Voice Effect Utility using Web Audio API
// Creates metallic/robotic voice effect similar to the original Pokedex

class PokedexVoice {
  constructor() {
    this.audioContext = null
    this.isInitialized = false
  }

  init() {
    if (!this.isInitialized) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.isInitialized = true
    }
  }

  // Apply metallic/robotic effect to speech
  speakWithEffect(text, onComplete = null) {
    this.init()
    
    // First, use speech synthesis to generate audio
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'es-ES'
    utterance.rate = 0.6
    utterance.pitch = 0.3
    utterance.volume = 1
    
    // Get robotic voice
    const voices = window.speechSynthesis.getVoices()
    const roboticVoice = voices.find(v => 
      v.name.includes('Google español') || 
      v.name.includes('Diego') || 
      v.name.includes('Carlos') ||
      v.name.includes('Microsoft Pablo') ||
      v.name.includes('Roberto')
    )
    if (roboticVoice) {
      utterance.voice = roboticVoice
    }

    // Speak with processing
    this.processAndSpeak(utterance, onComplete)
  }

  processAndSpeak(utterance, onComplete) {
    // For browsers that support audio processing, we'd need to:
    // 1. Capture the speech audio stream
    // 2. Apply effects using Web Audio API
    // 3. Output the processed audio
    
    // Since capturing synthesized speech requires more complex setup,
    // we'll apply the closest possible effect using speech parameters
    // and optional beep sounds for that "tech" feel
    
    // Play start beep
    this.playBeep(880, 0.1, 0.1)
    
    // Speak
    speechSynthesis.speak(utterance)
    
    utterance.onend = () => {
      // Play end beep
      this.playBeep(660, 0.1, 0.05)
      if (onComplete) onComplete()
    }
  }

  // Generate metallic beep sound
  playBeep(frequency = 880, duration = 0.1, volume = 0.1) {
    this.init()
    
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
