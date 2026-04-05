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
const IMG_SIZE = 128  // Reducido para entrenar más rápido
const NUM_CLASSES = 15

// Crear directorio
if (!fs.existsSync(MODEL_DIR)) {
  fs.mkdirSync(MODEL_DIR, { recursive: true })
}

// Modelo CNN ligero
function createLightModel() {
  const model = tf.sequential()

  model.add(tf.layers.conv2d({
    inputShape: [IMG_SIZE, IMG_SIZE, 3],
    filters: 8,
    kernelSize: 3,
    activation: 'relu'
  }))
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }))

  model.add(tf.layers.conv2d({
    filters: 16,
    kernelSize: 3,
    activation: 'relu'
  }))
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }))

  model.add(tf.layers.conv2d({
    filters: 32,
    kernelSize: 3,
    activation: 'relu'
  }))
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }))

  model.add(tf.layers.flatten())

  model.add(tf.layers.dense({
    units: 64,
    activation: 'relu'
  }))

  model.add(tf.layers.dense({
    units: NUM_CLASSES,
    activation: 'softmax'
  }))

  return model
}

// Generar datos sintéticos ligeros
function generateMockData() {
  const numPerClass = 20
  const xs = []
  const ys = []

  for (let classIdx = 0; classIdx < NUM_CLASSES; classIdx++) {
    for (let i = 0; i < numPerClass; i++) {
      const image = tf.randomNormal([IMG_SIZE, IMG_SIZE, 3], classIdx * 0.1, 0.5)
      xs.push(image)

      const oneHot = new Array(NUM_CLASSES).fill(0)
      oneHot[classIdx] = 1
      ys.push(oneHot)
    }
  }

  return {
    xs: tf.stack(xs),
    ys: tf.tensor2d(ys)
  }
}

async function train() {
  console.log('🚀 Entrenando modelo ligero...')
  console.log(`Backend: ${tf.getBackend()}`)

  const model = createLightModel()

  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  })

  console.log('\nArquitectura:')
  model.summary()

  const { xs, ys } = generateMockData()
  console.log(`\n📊 Datos: ${xs.shape[0]} muestras`)

  console.log('\n🏋️  Entrenando...')
  await model.fit(xs, ys, {
    epochs: 10,
    batchSize: 16,
    verbose: 1
  })

  console.log('\n💾 Guardando modelo...')
  await model.save(`file://${MODEL_DIR}`)

  const metadata = {
    version: '1.0.0',
    numClasses: NUM_CLASSES,
    imageSize: IMG_SIZE,
    createdAt: new Date().toISOString()
  }
  fs.writeFileSync(
    path.join(MODEL_DIR, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  )

  console.log('\n✅ Modelo guardado en:', MODEL_DIR)

  xs.dispose()
  ys.dispose()
  model.dispose()
}

train().catch(err => {
  console.error('Error:', err)
  process.exit(1)
})
