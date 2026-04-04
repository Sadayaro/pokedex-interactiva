// Pokédex Interactiva - Aplicación Principal
class PokedexApp {
    constructor() {
        this.video = document.getElementById('camera');
        this.canvas = document.getElementById('capture-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.statusText = document.getElementById('status-text');
        this.pokemonName = document.getElementById('pokemon-name');
        this.pokemonInfo = document.getElementById('pokemon-info');
        this.pokemonDetails = document.getElementById('pokemon-details');
        this.model = null;
        this.isScanning = false;
        this.currentPokemon = null;
        this.stream = null;
        this.selectedType = 'all';
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        await this.loadModel();
    }
    
    setupEventListeners() {
        // Botón de inicio
        document.getElementById('btn-start').addEventListener('click', () => {
            this.startPokedex();
        });
        
        // Botones de control
        document.getElementById('btn-camera').addEventListener('click', () => {
            this.toggleCamera();
        });
        
        document.getElementById('btn-scan').addEventListener('click', () => {
            this.scanPokemon();
        });
        
        document.getElementById('btn-info').addEventListener('click', () => {
            this.speakCurrentPokemon();
        });
        
        document.getElementById('btn-voice').addEventListener('click', () => {
            this.speakCurrentPokemon();
        });
        
        document.getElementById('btn-search').addEventListener('click', () => {
            this.showRandomPokemon();
        });
        
        // Botones de tipo
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectedType = e.target.dataset.type;
                this.filterByType(this.selectedType);
            });
        });
        
        // Teclado numérico
        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleNumPad(e.target.textContent);
            });
        });
    }
    
    async loadModel() {
        try {
            this.updateStatus('Cargando modelo de reconocimiento...');
            this.model = await mobilenet.load();
            this.updateStatus('Sistema listo');
            console.log('Modelo MobileNet cargado');
        } catch (error) {
            console.error('Error cargando modelo:', error);
            this.updateStatus('Error al cargar modelo');
        }
    }
    
    async startPokedex() {
        try {
            // Solicitar permisos de cámara
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 640 },
                    height: { ideal: 480 }
                }, 
                audio: false 
            });
            
            this.video.srcObject = this.stream;
            
            // Ocultar overlay
            document.getElementById('start-overlay').classList.add('hidden');
            
            // Mensaje de bienvenida con voz
            this.speak('Pokédex activada. Sistema listo para escanear Pokémon.');
            
        } catch (error) {
            console.error('Error accediendo a cámara:', error);
            alert('No se pudo acceder a la cámara. Por favor permite el acceso e intenta de nuevo.');
        }
    }
    
    toggleCamera() {
        if (this.video.style.display === 'none') {
            this.video.style.display = 'block';
            document.getElementById('pokemon-image').style.display = 'none';
        }
    }
    
    async scanPokemon() {
        if (!this.model) {
            this.updateStatus('Modelo no cargado aún');
            return;
        }
        
        if (this.isScanning) return;
        
        this.isScanning = true;
        this.updateStatus('Escaneando...');
        
        // Efectos visuales de escaneo
        document.querySelector('.main-light').classList.add('scanning');
        document.getElementById('scanning-effect').style.display = 'block';
        document.getElementById('btn-scan').disabled = true;
        
        // Sonido de escaneo
        this.playScanSound();
        
        // Esperar 2 segundos para el efecto
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
            // Capturar frame del video
            this.canvas.width = this.video.videoWidth || 640;
            this.canvas.height = this.video.videoHeight || 480;
            this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
            
            // Clasificar imagen
            const predictions = await this.model.classify(this.canvas);
            console.log('Predicciones:', predictions);
            
            // Buscar Pokémon basado en las predicciones
            const detectedPokemon = this.findPokemonFromPredictions(predictions);
            
            if (detectedPokemon) {
                this.displayPokemon(detectedPokemon);
                this.speakPokemonFound(detectedPokemon);
            } else {
                // Si no se reconoce específicamente, mostrar uno aleatorio
                const randomPokemon = this.getRandomPokemon();
                this.displayPokemon(randomPokemon, true);
                this.speakPokemonFound(randomPokemon);
            }
            
        } catch (error) {
            console.error('Error en escaneo:', error);
            this.updateStatus('Error en escaneo');
        } finally {
            this.isScanning = false;
            document.querySelector('.main-light').classList.remove('scanning');
            document.getElementById('scanning-effect').style.display = 'none';
            document.getElementById('btn-scan').disabled = false;
        }
    }
    
    findPokemonFromPredictions(predictions) {
        // Mapeo de posibles predicciones a Pokémon
        const keywordsToPokemon = {
            'cat': 'Meowth',
            'dog': 'Growlithe',
            'turtle': 'Squirtle',
            'lizard': 'Charmander',
            'dragon': 'Dragonite',
            'snake': 'Arbok',
            'fish': 'Magikarp',
            'butterfly': 'Butterfree',
            'mouse': 'Pikachu',
            'fox': 'Eevee',
            'wolf': 'Arcanine',
            'elephant': 'Snorlax',
            'bird': 'Pidgey',
            'duck': 'Psyduck',
            'chicken': 'Torchic',
            'penguin': 'Piplup',
            'seal': 'Seel',
            'dolphin': 'Lapras'
        };
        
        for (const prediction of predictions) {
            const className = prediction.className.toLowerCase();
            
            // Buscar coincidencias
            for (const [keyword, pokemonName] of Object.entries(keywordsToPokemon)) {
                if (className.includes(keyword)) {
                    return findPokemonByName(pokemonName);
                }
            }
        }
        
        // Si no hay coincidencia, buscar por color o características
        return null;
    }
    
    getRandomPokemon() {
        const available = this.selectedType === 'all' 
            ? POKEMON_DATABASE 
            : getPokemonByType(this.selectedType);
        return available[Math.floor(Math.random() * available.length)];
    }
    
    displayPokemon(pokemon, isSimulation = false) {
        this.currentPokemon = pokemon;
        
        // Actualizar pantalla de información
        this.pokemonName.textContent = pokemon.name;
        this.pokemonInfo.style.display = 'none';
        this.pokemonDetails.style.display = 'block';
        this.pokemonDetails.classList.add('pokemon-found');
        
        // Llenar detalles
        const typesHtml = pokemon.types.map(type => 
            `<span class="type-badge" style="background-color: ${this.getTypeColor(type)}">${getTypeName(type)}</span>`
        ).join('');
        
        document.getElementById('pokemon-type').innerHTML = typesHtml;
        document.getElementById('pokemon-height').textContent = pokemon.height;
        document.getElementById('pokemon-weight').textContent = pokemon.weight;
        document.getElementById('pokemon-ability').textContent = pokemon.ability;
        document.getElementById('pokemon-description').textContent = pokemon.description;
        
        // Mostrar imagen placeholder (usando sprites de Pokémon)
        const pokemonImage = document.getElementById('pokemon-image');
        pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        pokemonImage.style.display = 'block';
        pokemonImage.classList.add('pokemon-found');
        this.video.style.display = 'none';
        
        // Actualizar status
        this.updateStatus(`${isSimulation ? 'Simulación' : 'Pokémon encontrado'}: ${pokemon.name}`);
        
        // Activar LEDs
        document.querySelector('.led-1').classList.add('active');
        setTimeout(() => {
            document.querySelector('.led-2').classList.add('active');
        }, 500);
    }
    
    speakPokemonFound(pokemon) {
        const message = `¡${pokemon.name} detectado! Es un Pokémon de tipo ${pokemon.types.map(t => getTypeName(t)).join(' y ')}. ${pokemon.description}`;
        this.speak(message);
    }
    
    speakCurrentPokemon() {
        if (this.currentPokemon) {
            this.speakPokemonFound(this.currentPokemon);
        } else {
            this.speak('No hay ningún Pokémon detectado. Por favor escanea primero.');
        }
    }
    
    speak(text) {
        if ('speechSynthesis' in window) {
            // Cancelar cualquier speech anterior
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES';
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 1;
            
            // Intentar encontrar una voz española
            const voices = window.speechSynthesis.getVoices();
            const spanishVoice = voices.find(voice => 
                voice.lang.startsWith('es') || voice.name.includes('Spanish')
            );
            
            if (spanishVoice) {
                utterance.voice = spanishVoice;
            }
            
            window.speechSynthesis.speak(utterance);
        } else {
            console.log('Síntesis de voz no soportada');
        }
    }
    
    playScanSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio no soportado');
        }
    }
    
    showRandomPokemon() {
        const random = this.getRandomPokemon();
        this.displayPokemon(random, true);
        this.speakPokemonFound(random);
    }
    
    filterByType(type) {
        this.selectedType = type;
        const count = getPokemonByType(type).length;
        this.updateStatus(`Filtrado: ${type === 'all' ? 'Todos' : getTypeName(type)} (${count} Pokémon)`);
        
        // Resaltar botón seleccionado
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.style.transform = btn.dataset.type === type ? 'scale(1.1)' : 'scale(1)';
        });
    }
    
    handleNumPad(num) {
        // Implementar búsqueda por número
        const id = parseInt(num);
        if (id > 0 && id <= 151) {
            const pokemon = findPokemonById(id);
            if (pokemon) {
                this.displayPokemon(pokemon);
                this.speakPokemonFound(pokemon);
            }
        }
    }
    
    updateStatus(message) {
        this.statusText.textContent = message;
        console.log('Status:', message);
    }
    
    getTypeColor(type) {
        const colors = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dragon: '#7038F8',
            dark: '#705848',
            steel: '#B8B8D0',
            fairy: '#EE99AC'
        };
        return colors[type] || '#888';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar voces de speech synthesis
    if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
    }
    
    // Iniciar aplicación
    window.pokedexApp = new PokedexApp();
});

// Cargar voces cuando estén disponibles
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
    };
}
