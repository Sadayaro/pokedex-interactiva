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

// Crear modelo
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

model.add(tf.layers.conv2d({
  filters: 64,
  kernelSize: 3,
  activation: 'relu'
}))
model.add(tf.layers.maxPooling2d({ poolSize: 2 }))

model.add(tf.layers.flatten())

model.add(tf.layers.dense({
  units: 128,
  activation: 'relu'
}))
model.add(tf.layers.dropout({ rate: 0.3 }))

model.add(tf.layers.dense({
  units: 15,
  activation: 'softmax'
}))

// Compilar para inicializar pesos
model.compile({
  optimizer: tf.train.adam(0.001),
  loss: 'categoricalCrossentropy'
})

// Hacer una predicción dummy para inicializar pesos
const dummy = tf.zeros([1, 224, 224, 3])
model.predict(dummy)
dummy.dispose()

console.log('💾 Guardando modelo...')

// Guardar usando el formato HTTP para luego copiar
const handler = tf.io.fileSystem(MODEL_DIR)
await model.save(handler)

// Crear metadata
const metadata = {
  version: '1.0.0',
  numClasses: 15,
  imageSize: 224,
  classes: [
    { index: 0, pokemonId: 1, name: 'Bulbasaur' },
    { index: 1, pokemonId: 2, name: 'Ivysaur' },
    { index: 2, pokemonId: 3, name: 'Venusaur' },
    { index: 3, pokemonId: 4, name: 'Charmander' },
    { index: 4, pokemonId: 5, name: 'Charmeleon' },
    { index: 5, pokemonId: 6, name: 'Charizard' },
    { index: 6, pokemonId: 7, name: 'Squirtle' },
    { index: 7, pokemonId: 8, name: 'Wartortle' },
    { index: 8, pokemonId: 9, name: 'Blastoise' },
    { index: 9, pokemonId: 25, name: 'Pikachu' },
    { index: 10, pokemonId: 26, name: 'Raichu' },
    { index: 11, pokemonId: 133, name: 'Eevee' },
    { index: 12, pokemonId: 143, name: 'Snorlax' },
    { index: 13, pokemonId: 150, name: 'Mewtwo' },
    { index: 14, pokemonId: 151, name: 'Mew' }
  ],
  createdAt: new Date().toISOString()
}

fs.writeFileSync(
  path.join(MODEL_DIR, 'metadata.json'),
  JSON.stringify(metadata, null, 2)
)

console.log('✅ Modelo guardado!')
const files = fs.readdirSync(MODEL_DIR)
files.forEach(f => console.log(`   - ${f}`))

model.dispose()
