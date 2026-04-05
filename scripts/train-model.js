import * as tf from '@tensorflow/tfjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurar backend CPU
await tf.setBackend('cpu')
await tf.ready()

const MODEL_DIR = path.join(__dirname, '..', 'public', 'pokemon-model')
const IMG_SIZE = 224

// Lista de Pokémon (16 iniciales)
const POKEMON_LIST = [
  { id: 1, name: 'Bulbasaur' },
  { id: 2, name: 'Ivysaur' },
  { id: 3, name: 'Venusaur' },
  { id: 4, name: 'Charmander' },
  { id: 5, name: 'Charmeleon' },
  { id: 6, name: 'Charizard' },
  { id: 7, name: 'Squirtle' },
  { id: 8, name: 'Wartortle' },
  { id: 9, name: 'Blastoise' },
  { id: 25, name: 'Pikachu' },
  { id: 26, name: 'Raichu' },
  { id: 133, name: 'Eevee' },
  { id: 143, name: 'Snorlax' },
  { id: 150, name: 'Mewtwo' },
  { id: 151, name: 'Mew' }
]

const NUM_CLASSES = POKEMON_LIST.length

// Crear directorio si no existe
if (!fs.existsSync(MODEL_DIR)) {
  fs.mkdirSync(MODEL_DIR, { recursive: true })
}

// Crear modelo CNN
function createModel() {
  const model = tf.sequential()

  // Capa convolucional 1
  model.add(tf.layers.conv2d({
    inputShape: [IMG_SIZE, IMG_SIZE, 3],
    filters: 32,
    kernelSize: 3,
    activation: 'relu'
  }))
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }))
  model.add(tf.layers.batchNormalization())

  // Capa convolucional 2
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu'
  }))
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }))
  model.add(tf.layers.batchNormalization())

  // Capa convolucional 3
  model.add(tf.layers.conv2d({
    filters: 128,
    kernelSize: 3,
    activation: 'relu'
  }))
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }))
  model.add(tf.layers.batchNormalization())

  // Capa convolucional 4
  model.add(tf.layers.conv2d({
    filters: 256,
    kernelSize: 3,
    activation: 'relu'
  }))
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }))
  model.add(tf.layers.batchNormalization())

  // Aplanar
  model.add(tf.layers.flatten())

  // Capa densa 1
  model.add(tf.layers.dense({
    units: 512,
    activation: 'relu'
  }))
  model.add(tf.layers.dropout({ rate: 0.5 }))

  // Capa densa 2
  model.add(tf.layers.dense({
    units: 256,
    activation: 'relu'
  }))
  model.add(tf.layers.dropout({ rate: 0.3 }))

  // Capa de salida
  model.add(tf.layers.dense({
    units: NUM_CLASSES,
    activation: 'softmax'
  }))

  return model
}

// Generar datos sintéticos para entrenamiento (simulación)
function generateMockData(numSamples = 100) {
  const xs = []
  const ys = []

  for (let i = 0; i < numSamples; i++) {
    // Generar imagen aleatoria
    const image = tf.randomNormal([IMG_SIZE, IMG_SIZE, 3])
    xs.push(image)

    // Etiqueta aleatoria
    const label = Math.floor(Math.random() * NUM_CLASSES)
    const oneHot = new Array(NUM_CLASSES).fill(0)
    oneHot[label] = 1
    ys.push(oneHot)
  }

  return {
    xs: tf.stack(xs),
    ys: tf.tensor2d(ys)
  }
}

// Entrenar modelo
async function trainModel() {
  console.log('🚀 Iniciando entrenamiento del modelo Pokémon...')
  console.log(`📊 Clases: ${NUM_CLASSES} Pokémon`)
  console.log(`🖼️  Tamaño de imagen: ${IMG_SIZE}x${IMG_SIZE}`)

  const model = createModel()

  model.compile({
    optimizer: tf.train.adam(0.0001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  })

  console.log('\n📐 Arquitectura del modelo:')
  model.summary()

  // Generar datos de entrenamiento sintéticos
  console.log('\n📥 Generando datos de entrenamiento...')
  const { xs, ys } = generateMockData(500)

  // Entrenar
  console.log('\n🏋️  Entrenando...')
  await model.fit(xs, ys, {
    epochs: 10,
    batchSize: 16,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(`Época ${epoch + 1}/10 - Pérdida: ${logs.loss.toFixed(4)} - Precisión: ${(logs.acc * 100).toFixed(2)}%`)
      }
    }
  })

  // Guardar modelo
  console.log('\n💾 Guardando modelo...')
  await model.save(`file://${MODEL_DIR}`)

  // Crear archivo de metadatos
  const metadata = {
    version: '1.0.0',
    numClasses: NUM_CLASSES,
    imageSize: IMG_SIZE,
    pokemon: pokemonData.map(p => ({
      id: p.id,
      name: p.name,
      index: pokemonData.indexOf(p)
    })),
    createdAt: new Date().toISOString()
  }

  fs.writeFileSync(
    path.join(MODEL_DIR, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  )

  console.log('\n✅ Modelo entrenado y guardado exitosamente!')
  console.log(`📁 Ubicación: ${MODEL_DIR}`)
  console.log(`📄 Archivos: model.json, weights.bin, metadata.json`)

  // Liberar memoria
  xs.dispose()
  ys.dispose()
  model.dispose()
}

trainModel().catch(err => {
  console.error('❌ Error entrenando:', err)
  process.exit(1)
})
