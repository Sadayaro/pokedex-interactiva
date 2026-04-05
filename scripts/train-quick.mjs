import * as tf from '@tensorflow/tfjs'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

await tf.setBackend('cpu')
await tf.ready()

const MODEL_DIR = path.join(__dirname, '..', 'public', 'pokemon-model')
if (!fs.existsSync(MODEL_DIR)) fs.mkdirSync(MODEL_DIR, { recursive: true })

// Modelo ultra ligero: solo 2 convoluciones
const model = tf.sequential()

model.add(tf.layers.conv2d({
  inputShape: [64, 64, 3],
  filters: 4,
  kernelSize: 3,
  activation: 'relu'
}))
model.add(tf.layers.maxPooling2d({ poolSize: 2 }))

model.add(tf.layers.conv2d({ filters: 8, kernelSize: 3, activation: 'relu' }))
model.add(tf.layers.maxPooling2d({ poolSize: 2 }))

model.add(tf.layers.flatten())
model.add(tf.layers.dense({ units: 32, activation: 'relu' }))
model.add(tf.layers.dense({ units: 15, activation: 'softmax' }))

model.compile({
  optimizer: tf.train.adam(0.01),
  loss: 'categoricalCrossentropy'
})

console.log('🏋️ Entrenando modelo ultra-ligero...')

// Datos mínimos: 10 muestras por clase
const xs = []
const ys = []
for (let c = 0; c < 15; c++) {
  for (let i = 0; i < 10; i++) {
    xs.push(tf.randomNormal([64, 64, 3], c * 0.05, 0.3))
    const oneHot = new Array(15).fill(0)
    oneHot[c] = 1
    ys.push(oneHot)
  }
}

const xTrain = tf.stack(xs)
const yTrain = tf.tensor2d(ys)

await model.fit(xTrain, yTrain, {
  epochs: 3,
  batchSize: 10,
  verbose: 0
})

console.log('💾 Guardando...')
await model.save(`file://${MODEL_DIR}`)

fs.writeFileSync(
  path.join(MODEL_DIR, 'metadata.json'),
  JSON.stringify({
    version: '1.0.0',
    numClasses: 15,
    imageSize: 64,
    createdAt: new Date().toISOString()
  }, null, 2)
)

console.log('✅ Modelo entrenado y guardado!')
console.log('📁 Ubicación:', MODEL_DIR)

xTrain.dispose()
yTrain.dispose()
model.dispose()
