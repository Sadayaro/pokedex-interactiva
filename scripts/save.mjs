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

// Crear modelo simple
const model = tf.sequential()

model.add(tf.layers.conv2d({
  inputShape: [224, 224, 3],
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
model.add(tf.layers.dense({ units: 128, activation: 'relu' }))
model.add(tf.layers.dense({ units: 15, activation: 'softmax' }))

model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' })

// Inicializar con predicción dummy
const dummy = tf.zeros([1, 224, 224, 3])
model.predict(dummy).dispose()
dummy.dispose()

// Guardar usando file:// URL
const modelPath = `file://${MODEL_DIR}/model.json`
console.log('Guardando en:', modelPath)

await model.save(modelPath)

console.log('✅ Modelo guardado!')
const files = fs.readdirSync(MODEL_DIR)
files.forEach(f => {
  const stats = fs.statSync(path.join(MODEL_DIR, f))
  console.log(`   - ${f} (${(stats.size/1024).toFixed(1)} KB)`)
})

model.dispose()
