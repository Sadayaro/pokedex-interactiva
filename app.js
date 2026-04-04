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
            
            // Análisis visual real: MobileNet + colores
            const predictions = await this.model.classify(this.canvas);
            const dominantColors = this.analyzeColors();
            
            console.log('Predicciones:', predictions);
            console.log('Colores dominantes:', dominantColors);
            
            // Buscar Pokémon basado en análisis visual real
            const detectedPokemon = this.findPokemonByVisualMatch(predictions, dominantColors);
            
            if (detectedPokemon) {
                this.displayPokemon(detectedPokemon);
                this.speakPokemonFound(detectedPokemon);
            } else {
                // Si no hay coincidencia clara, mostrar mensaje de no reconocido
                this.updateStatus('No se pudo identificar un Pokémon. Intenta con otro objeto o mejor iluminación.');
                this.speak('No se pudo identificar un Pokémon. Intenta nuevamente.');
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
    
    analyzeColors() {
        // Analizar colores dominantes de la imagen
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        const colorCounts = {};
        
        // Muestrear cada 10 píxeles para optimizar
        for (let i = 0; i < data.length; i += 40) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Categorizar colores en rangos básicos
            const color = this.categorizeColor(r, g, b);
            colorCounts[color] = (colorCounts[color] || 0) + 1;
        }
        
        // Ordenar por frecuencia
        const sortedColors = Object.entries(colorCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(entry => entry[0]);
        
        return sortedColors;
    }
    
    categorizeColor(r, g, b) {
        // Determinar color dominante
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const brightness = (r + g + b) / 3;
        
        // Colores oscuros (sombra/negro)
        if (brightness < 30) return 'black';
        if (brightness > 220) return 'white';
        
        // Colores brillantes
        if (max === r && r > 150 && g < 100 && b < 100) return 'red';
        if (max === r && r > 150 && g > 100 && b < 100) return 'orange';
        if (max === r && r > 200 && g > 150 && b < 100) return 'gold';
        if (max === g && g > 150 && r < 100 && b < 100) return 'green';
        if (max === g && g > 150 && r > 150 && b < 100) return 'yellow';
        if (max === b && b > 150 && r < 100 && g < 100) return 'blue';
        if (max === b && b > 150 && r > 150 && g > 150) return 'white';
        if (max === b && b > 100 && r > 100 && g < 100) return 'purple';
        if (r > 150 && g > 100 && b > 150) return 'pink';
        if (r > 100 && g > 100 && b < 50) return 'brown';
        if (max === r && g > 100 && b > 100) return 'pink';
        if (max === b && g > 100) return 'teal';
        if (brightness > 150) return 'gray';
        
        return 'brown';
    }
    
    findPokemonByVisualMatch(predictions, dominantColors) {
        let bestMatch = null;
        let highestScore = 0;
        
        // Palabras clave de MobileNet a categorías de Pokémon
        const categoryMapping = {
            'cat': ['cat', 'feline', 'kitten'],
            'dog': ['dog', 'canine', 'puppy', 'wolf', 'fox'],
            'turtle': ['turtle', 'tortoise', 'shell'],
            'lizard': ['lizard', 'reptile', 'gecko'],
            'dragon': ['dragon', 'dinosaur'],
            'snake': ['snake', 'serpent'],
            'fish': ['fish', 'aquatic', 'sea', 'ocean'],
            'butterfly': ['butterfly', 'moth', 'insect'],
            'mouse': ['mouse', 'rat', 'rodent'],
            'elephant': ['elephant', 'large mammal'],
            'bird': ['bird', 'duck', 'chicken', 'penguin', 'falcon', 'eagle'],
            'seal': ['seal', 'sea lion', 'walrus'],
            'monkey': ['monkey', 'ape', 'primate'],
            'horse': ['horse', 'pony', 'stallion'],
            'crab': ['crab', 'lobster', 'crustacean'],
            'bat': ['bat'],
            'plant': ['plant', 'flower', 'tree'],
            'ball': ['ball', 'sphere'],
            'rock': ['rock', 'stone', 'mountain']
        };
        
        // Obtener categorías detectadas por MobileNet
        const detectedCategories = [];
        for (const prediction of predictions) {
            const className = prediction.className.toLowerCase();
            for (const [category, keywords] of Object.entries(categoryMapping)) {
                if (keywords.some(keyword => className.includes(keyword))) {
                    detectedCategories.push(category);
                }
            }
        }
        
        // Evaluar cada Pokémon
        for (const pokemon of POKEMON_DATABASE) {
            let score = 0;
            const traits = pokemon.visualTraits;
            
            // Puntaje por coincidencia de categoría
            if (detectedCategories.includes(traits.category)) {
                score += 50;
            }
            
            // Puntaje por coincidencia de categoría relacionada
            for (const category of detectedCategories) {
                if (traits.shape.includes(category)) {
                    score += 30;
                }
            }
            
            // Puntaje por coincidencia de colores
            for (const color of dominantColors) {
                if (traits.colors.includes(color)) {
                    score += 20;
                }
            }
            
            // Bonus por tipos de filtro seleccionado
            if (this.selectedType !== 'all' && pokemon.types.includes(this.selectedType)) {
                score += 25;
            }
            
            // Actualizar mejor coincidencia
            if (score > highestScore && score >= 40) {
                highestScore = score;
                bestMatch = pokemon;
            }
        }
        
        return bestMatch;
    }
    
    displayPokemon(pokemon) {
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
        
        // Mostrar imagen del Pokémon detectado
        const pokemonImage = document.getElementById('pokemon-image');
        pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
        pokemonImage.style.display = 'block';
        pokemonImage.classList.add('pokemon-found');
        this.video.style.display = 'none';
        
        // Actualizar status
        this.updateStatus(`Pokémon encontrado: ${pokemon.name}`);
        
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
        // Función para mostrar un Pokémon aleatorio de la selección actual
        const available = this.selectedType === 'all' 
            ? POKEMON_DATABASE 
            : getPokemonByType(this.selectedType);
        const random = available[Math.floor(Math.random() * available.length)];
        this.displayPokemon(random);
        this.speak(`Mostrando ${random.name} de la base de datos.`);
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
