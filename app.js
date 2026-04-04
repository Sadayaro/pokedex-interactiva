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
            this.updateStatus('Cargando modelos de reconocimiento...');
            
            // Cargar MobileNet (para análisis general)
            this.model = await mobilenet.load();
            console.log('✅ MobileNet cargado');
            
            // Intentar cargar modelo personalizado de Pokémon (si existe)
            try {
                this.pokemonModel = await tf.loadLayersModel('pokemon-model/model.json');
                console.log('✅ Modelo Pokémon personalizado cargado');
                this.usePokemonModel = true;
            } catch (e) {
                console.log('⚠️ Modelo Pokémon no encontrado, usando sistema híbrido (color + silueta)');
                this.usePokemonModel = false;
            }
            
            this.updateStatus('Sistema listo');
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
            
            let detectedPokemon = null;
            
            // OPCIÓN 1: Usar modelo CNN entrenado (si existe)
            if (this.usePokemonModel && this.pokemonModel) {
                console.log('🔍 Usando modelo CNN entrenado...');
                detectedPokemon = await this.classifyWithPokemonModel();
            } 
            // OPCIÓN 2: Usar sistema híbrido (color + silueta + MobileNet)
            else {
                console.log('🔍 Usando sistema híbrido...');
                const predictions = await this.model.classify(this.canvas);
                const dominantColors = this.analyzeColors();
                const silhouetteFeatures = this.analyzeSilhouette();
                
                console.log('Predicciones MobileNet:', predictions);
                console.log('Colores dominantes:', dominantColors);
                console.log('Características de silueta:', silhouetteFeatures);
                
                detectedPokemon = this.findPokemonByVisualMatch(predictions, dominantColors, silhouetteFeatures);
                
                if (!detectedPokemon) {
                    detectedPokemon = this.findBestPossibleMatch(predictions, dominantColors, silhouetteFeatures);
                }
            }
            
            if (detectedPokemon) {
                this.displayPokemon(detectedPokemon);
                this.speakPokemonFound(detectedPokemon);
            } else {
                this.updateStatus('No se pudo identificar. Intenta con mejor iluminación.');
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
    
    analyzeSilhouette() {
        // Análisis de silueta/contorno de la imagen
        const width = this.canvas.width;
        const height = this.canvas.height;
        const imageData = this.ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        // Crear matriz de bordes (edge detection simple)
        const edges = [];
        const threshold = 30; // Umbral para detectar cambios de color
        
        for (let y = 1; y < height - 1; y += 4) { // Muestrear cada 4 píxeles para optimizar
            for (let x = 1; x < width - 1; x += 4) {
                const idx = (y * width + x) * 4;
                const rightIdx = (y * width + (x + 1)) * 4;
                const bottomIdx = ((y + 1) * width + x) * 4;
                
                // Calcular diferencia de color con vecinos
                const diffRight = Math.abs(data[idx] - data[rightIdx]) + 
                                  Math.abs(data[idx + 1] - data[rightIdx + 1]) + 
                                  Math.abs(data[idx + 2] - data[rightIdx + 2]);
                
                const diffBottom = Math.abs(data[idx] - data[bottomIdx]) + 
                                   Math.abs(data[idx + 1] - data[bottomIdx + 1]) + 
                                   Math.abs(data[idx + 2] - data[bottomIdx + 2]);
                
                if (diffRight > threshold || diffBottom > threshold) {
                    edges.push({x: x / width, y: y / height}); // Normalizar 0-1
                }
            }
        }
        
        // Calcular características de la silueta
        const features = {
            edgeCount: edges.length,
            aspectRatio: this.calculateAspectRatio(edges),
            complexity: edges.length / (width * height / 16), // Densidad de bordes
            centroid: this.calculateCentroid(edges),
            boundingBox: this.calculateBoundingBox(edges),
            edgeDistribution: this.calculateEdgeDistribution(edges),
            hasWings: this.detectWingShape(edges),
            hasTail: this.detectTailShape(edges),
            isRound: this.detectRoundness(edges),
            isTall: this.detectTallness(edges),
            hasMultipleLimbs: this.detectMultipleLimbs(edges)
        };
        
        return features;
    }
    
    calculateAspectRatio(edges) {
        if (edges.length === 0) return 1;
        const xs = edges.map(e => e.x);
        const ys = edges.map(e => e.y);
        const width = Math.max(...xs) - Math.min(...xs);
        const height = Math.max(...ys) - Math.min(...ys);
        return width > 0 ? height / width : 1;
    }
    
    calculateCentroid(edges) {
        if (edges.length === 0) return {x: 0.5, y: 0.5};
        const avgX = edges.reduce((sum, e) => sum + e.x, 0) / edges.length;
        const avgY = edges.reduce((sum, e) => sum + e.y, 0) / edges.length;
        return {x: avgX, y: avgY};
    }
    
    calculateBoundingBox(edges) {
        if (edges.length === 0) return {width: 0, height: 0};
        const xs = edges.map(e => e.x);
        const ys = edges.map(e => e.y);
        return {
            width: Math.max(...xs) - Math.min(...xs),
            height: Math.max(...ys) - Math.min(...ys)
        };
    }
    
    calculateEdgeDistribution(edges) {
        // Dividir en 9 regiones (3x3 grid)
        const regions = Array(9).fill(0);
        edges.forEach(e => {
            const regionX = Math.min(2, Math.floor(e.x * 3));
            const regionY = Math.min(2, Math.floor(e.y * 3));
            regions[regionY * 3 + regionX]++;
        });
        const total = edges.length || 1;
        return regions.map(r => r / total);
    }
    
    detectWingShape(edges) {
        // Detectar alas: expansiones laterales en la parte superior
        const distribution = this.calculateEdgeDistribution(edges);
        // Más bordes en esquinas superiores (0, 2) y centros laterales (3, 5)
        const wingRegions = distribution[0] + distribution[2] + distribution[3] + distribution[5];
        return wingRegions > 0.3; // 30% de bordes en regiones de alas
    }
    
    detectTailShape(edges) {
        // Detectar cola: extensión inferior posterior
        const distribution = this.calculateEdgeDistribution(edges);
        const tailRegions = distribution[6] + distribution[8]; // Esquinas inferiores
        return tailRegions > 0.15;
    }
    
    detectRoundness(edges) {
        // Detectar redondez: distribución uniforme de bordes alrededor del centro
        const centroid = this.calculateCentroid(edges);
        const distances = edges.map(e => 
            Math.sqrt(Math.pow(e.x - centroid.x, 2) + Math.pow(e.y - centroid.y, 2))
        );
        const avgDist = distances.reduce((a, b) => a + b, 0) / distances.length;
        const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgDist, 2), 0) / distances.length;
        return variance < 0.02; // Baja varianza = forma circular
    }
    
    detectTallness(edges) {
        const aspectRatio = this.calculateAspectRatio(edges);
        return aspectRatio > 1.5; // Más alto que ancho
    }
    
    detectMultipleLimbs(edges) {
        // Detectar múltiples extremidades: bordes dispersos en 4+ regiones
        const distribution = this.calculateEdgeDistribution(edges);
        const activeRegions = distribution.filter(r => r > 0.1).length;
        return activeRegions >= 4;
    }
    
    // Comparar silueta detectada con características de Pokémon
    compareSilhouette(silhouette, pokemonTraits) {
        let score = 0;
        const bodyStyle = pokemonTraits.bodyStyle || '';
        
        // Puntuación basada en forma
        if (silhouette.hasWings && (
            bodyStyle.includes('alas') || bodyStyle.includes('ave') || 
            bodyStyle.includes('butterfly') || bodyStyle.includes('dragon')
        )) {
            score += 40;
        }
        
        if (silhouette.hasTail && (
            bodyStyle.includes('cola') || bodyStyle.includes('serpiente') ||
            bodyStyle.includes('dragon')
        )) {
            score += 30;
        }
        
        if (silhouette.isRound && (
            bodyStyle.includes('esfera') || bodyStyle.includes('redondo') ||
            bodyStyle === 'bipedo_redondo'
        )) {
            score += 35;
        }
        
        if (silhouette.isTall && (
            bodyStyle.includes('tallo') || bodyStyle.includes('palmera') ||
            bodyStyle === 'bipedo_largo'
        )) {
            score += 30;
        }
        
        if (silhouette.hasMultipleLimbs && (
            bodyStyle.includes('patas') || bodyStyle.includes('tentaculos') ||
            bodyStyle.includes('insecto')
        )) {
            score += 35;
        }
        
        // Aspecto general
        if (silhouette.aspectRatio > 1.3 && bodyStyle.includes('bipedo')) {
            score += 20;
        }
        
        if (silhouette.aspectRatio < 1.0 && bodyStyle.includes('cuadrupedo')) {
            score += 20;
        }
        
        if (silhouette.complexity > 0.1 && (
            bodyStyle.includes('detallado') || bodyStyle.includes('espinas')
        )) {
            score += 15;
        }
        
        return score;
    }
    
    // Clasificar usando modelo CNN entrenado
    async classifyWithPokemonModel() {
        if (!this.pokemonModel) return null;
        
        try {
            // Preprocesar imagen para el modelo (224x224)
            const tensor = tf.tidy(() => {
                const imageTensor = tf.browser.fromPixels(this.canvas);
                const resized = tf.image.resizeBilinear(imageTensor, [224, 224]);
                const normalized = resized.div(255.0);
                const batched = normalized.expandDims(0);
                return batched;
            });
            
            // Hacer predicción
            const predictions = await this.pokemonModel.predict(tensor).data();
            
            // Liberar memoria
            tensor.dispose();
            
            // Encontrar top 3 predicciones
            const top3 = Array.from(predictions)
                .map((prob, idx) => ({ pokemonId: idx + 1, probability: prob }))
                .sort((a, b) => b.probability - a.probability)
                .slice(0, 3);
            
            console.log('Top 3 predicciones del modelo:', top3);
            
            // Si la confianza es mayor al 50%, devolver el Pokémon
            if (top3[0].probability >= 0.50) {
                const pokemon = POKEMON_DATABASE.find(p => p.id === top3[0].pokemonId);
                if (pokemon) {
                    console.log(`✅ Modelo CNN detectó: ${pokemon.name} (${(top3[0].probability * 100).toFixed(1)}%)`);
                    return pokemon;
                }
            }
            
            return null;
        } catch (error) {
            console.error('Error en clasificación CNN:', error);
            return null;
        }
    }
    
    findPokemonByVisualMatch(predictions, dominantColors, silhouetteFeatures) {
        let bestMatch = null;
        let highestScore = 0;
        let bestConfidence = 0;
        
        const shapeDB = window.POKEMON_SHAPES_DATABASE;
        
        // Detectar formas desde MobileNet
        const detectedShapes = [];
        const detectedKeywords = [];
        
        for (const prediction of predictions) {
            const className = prediction.className.toLowerCase();
            detectedKeywords.push(...className.split(',').map(s => s.trim()));
            
            for (const [shapeName, shapeData] of Object.entries(shapeDB.bodyStyles)) {
                const keywords = shapeData.keyFeatures || [];
                if (keywords.some(kw => className.includes(kw))) {
                    detectedShapes.push(shapeName);
                }
            }
        }
        
        // Evaluar cada Pokémon con sistema de confianza (COLOR 60% + SILUETA 40%)
        for (const pokemon of POKEMON_DATABASE) {
            const traits = pokemon.visualTraits;
            
            // === COLOR (60% del score) ===
            let colorScore = 0;
            let colorConfidence = 0;
            
            const specificFeatures = shapeDB.pokemonSpecificFeatures[pokemon.name];
            if (specificFeatures) {
                const colorMatch = shapeDB.calculateColorSimilarity(
                    dominantColors, 
                    specificFeatures.colorSignature
                );
                colorScore += colorMatch * 100;
                colorConfidence += colorMatch * 0.6;
            }
            
            let colorMatches = 0;
            for (const color of dominantColors) {
                if (traits.colors.includes(color)) {
                    colorMatches++;
                    colorScore += 30;
                }
            }
            if (colorMatches > 0) {
                colorConfidence += (colorMatches / dominantColors.length) * 0.3;
            }
            
            // === SILUETA (40% del score) ===
            let silhouetteScore = 0;
            let silhouetteConfidence = 0;
            
            if (silhouetteFeatures) {
                silhouetteScore = this.compareSilhouette(silhouetteFeatures, traits);
                silhouetteConfidence = Math.min(0.4, silhouetteScore / 200); // Max 40%
            }
            
            // === COMBINACIÓN ===
            const totalScore = colorScore + silhouetteScore;
            const totalConfidence = colorConfidence + silhouetteConfidence;
            
            // Bonus adicionales
            if (detectedShapes.includes(traits.bodyStyle)) {
                totalScore += 50;
                totalConfidence += 0.1;
            }
            
            if (this.selectedType !== 'all' && pokemon.types.includes(this.selectedType)) {
                totalScore += 20;
                totalConfidence += 0.05;
            }
            
            // Umbral mínimo del 50% de confianza
            if (totalConfidence >= 0.50 && totalScore > highestScore) {
                highestScore = totalScore;
                bestConfidence = totalConfidence;
                bestMatch = pokemon;
            }
        }
        
        console.log('Mejor coincidencia:', bestMatch?.name, 'Confianza:', bestConfidence?.toFixed(2));
        
        return bestMatch;
    }
    
    findBestPossibleMatch(predictions, dominantColors, silhouetteFeatures) {
        // Siempre devuelve el Pokémon con mayor score basado en COLOR + SILUETA
        let bestMatch = null;
        let highestScore = -1;
        
        const shapeDB = window.POKEMON_SHAPES_DATABASE;
        
        // Detectar formas desde MobileNet
        const detectedShapes = [];
        
        for (const prediction of predictions) {
            const className = prediction.className.toLowerCase();
            
            for (const [shapeName, shapeData] of Object.entries(shapeDB.bodyStyles)) {
                const keywords = shapeData.keyFeatures || [];
                if (keywords.some(kw => className.includes(kw))) {
                    detectedShapes.push(shapeName);
                }
            }
        }
        
        for (const pokemon of POKEMON_DATABASE) {
            let score = 0;
            const traits = pokemon.visualTraits;
            
            // COLOR (60%)
            const specificFeatures = shapeDB.pokemonSpecificFeatures[pokemon.name];
            if (specificFeatures) {
                const colorMatch = shapeDB.calculateColorSimilarity(
                    dominantColors, 
                    specificFeatures.colorSignature
                );
                score += colorMatch * 60;
            }
            
            for (const color of dominantColors) {
                if (traits.colors.includes(color)) score += 15;
            }
            
            // SILUETA (40%)
            if (silhouetteFeatures) {
                const silhouetteScore = this.compareSilhouette(silhouetteFeatures, traits);
                score += silhouetteScore * 0.4;
            }
            
            // Bonus de forma
            if (detectedShapes.includes(traits.bodyStyle)) score += 40;
            
            if (this.selectedType !== 'all' && pokemon.types.includes(this.selectedType)) {
                score += 20;
            }
            
            if (score > highestScore) {
                highestScore = score;
                bestMatch = pokemon;
            }
        }
        
        // Fallback por colores si no hay match
        if (!bestMatch && dominantColors.length > 0) {
            for (const pokemon of POKEMON_DATABASE) {
                let colorScore = 0;
                for (const color of dominantColors.slice(0, 3)) {
                    if (pokemon.visualTraits.colors.includes(color)) colorScore++;
                }
                if (colorScore > 0 && (!bestMatch || colorScore > highestScore)) {
                    highestScore = colorScore;
                    bestMatch = pokemon;
                }
            }
        }
        
        // Último recurso: elegir por tipo seleccionado
        if (!bestMatch && this.selectedType !== 'all') {
            const typePokemon = getPokemonByType(this.selectedType);
            if (typePokemon.length > 0) {
                bestMatch = typePokemon[Math.floor(Math.random() * typePokemon.length)];
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
        
        // Mostrar imagen del Pokémon detectado usando imagen oficial de Pokemon.com
        const pokemonImage = document.getElementById('pokemon-image');
        const formattedId = String(pokemon.id).padStart(3, '0');
        pokemonImage.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${formattedId}.png`;
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
            window.speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'es-ES';
            
            // Configuración tipo Pokédex ANIME (voz robótica aguda)
            utterance.rate = 0.70;      // Más lento, muy pausado
            utterance.pitch = 1.30;     // AGUDO - efecto robótico característico
            utterance.volume = 0.95;
            
            const voices = window.speechSynthesis.getVoices();
            
            // Prioridad: voces femeninas agudas tipo robótico
            // Zira (Windows) o Google US English son las mejores para efecto robótico
            const pokedexVoice = voices.find(v => 
                v.name.includes('Zira') && v.lang.startsWith('en')
            ) || voices.find(v => 
                v.name.includes('Google US English') && v.lang.startsWith('en')
            ) || voices.find(v => 
                v.name.includes('Samantha') && v.lang.startsWith('en')
            ) || voices.find(v => 
                v.name.includes('Microsoft Helena') && v.lang.startsWith('es')
            ) || voices.find(v => 
                v.name.includes('Google Español')
            ) || voices.find(v => 
                v.lang.startsWith('es')
            ) || voices[0];
            
            if (pokedexVoice) {
                utterance.voice = pokedexVoice;
            }
            
            // Efecto beep-beep tipo Pokédex ANIME (más agudo)
            this.playPokedexBeep();
            
            // Pausa más larga antes de hablar (como la Pokédex real)
            setTimeout(() => {
                window.speechSynthesis.speak(utterance);
            }, 600);
        } else {
            console.log('Síntesis de voz no soportada');
        }
    }
    
    playPokedexBeep() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Sonido característico "Ding-Ding" de la Pokédex ANIME
            const playBeep = (freq, start, duration, vol = 0.2) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(audioContext.destination);
                
                // Tono más agudo tipo Pokédex
                osc.frequency.setValueAtTime(freq, audioContext.currentTime + start);
                osc.type = 'square'; // Onda cuadrada = más robótico
                
                // Envolvente más pronunciada
                gain.gain.setValueAtTime(0, audioContext.currentTime + start);
                gain.gain.linearRampToValueAtTime(vol, audioContext.currentTime + start + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + start + duration);
                
                osc.start(audioContext.currentTime + start);
                osc.stop(audioContext.currentTime + start + duration);
            };
            
            // Beep-beep característico de la Pokédex (frecuencias más altas)
            playBeep(1500, 0, 0.12, 0.25);      // Primer beep agudo
            playBeep(1500, 0.18, 0.12, 0.25);   // Segundo beep agudo
            
        } catch (error) {
            console.log('Audio no soportado');
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
