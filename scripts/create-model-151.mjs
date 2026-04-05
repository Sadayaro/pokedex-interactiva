import * as tf from '@tensorflow/tfjs'
import * as fs from 'fs'
import * as path from 'path'

console.log('🏗️  Creando nuevo modelo CNN para 151 Pokemon...')

// Crear modelo CNN más profundo para 151 clases
const model = tf.sequential()

// Bloque 1: Conv2D + MaxPooling
model.add(tf.layers.conv2d({
  inputShape: [224, 224, 3],
  filters: 32,
  kernelSize: 3,
  activation: 'relu',
  padding: 'same',
  name: 'conv2d_block1_1'
}))
model.add(tf.layers.conv2d({
  filters: 32,
  kernelSize: 3,
  activation: 'relu',
  padding: 'same',
  name: 'conv2d_block1_2'
}))
model.add(tf.layers.maxPooling2d({
  poolSize: 2,
  strides: 2,
  name: 'maxpool_block1'
}))
model.add(tf.layers.dropout({ rate: 0.25, name: 'dropout_block1' }))

// Bloque 2: Conv2D + MaxPooling
model.add(tf.layers.conv2d({
  filters: 64,
  kernelSize: 3,
  activation: 'relu',
  padding: 'same',
  name: 'conv2d_block2_1'
}))
model.add(tf.layers.conv2d({
  filters: 64,
  kernelSize: 3,
  activation: 'relu',
  padding: 'same',
  name: 'conv2d_block2_2'
}))
model.add(tf.layers.maxPooling2d({
  poolSize: 2,
  strides: 2,
  name: 'maxpool_block2'
}))
model.add(tf.layers.dropout({ rate: 0.25, name: 'dropout_block2' }))

// Bloque 3: Conv2D + MaxPooling
model.add(tf.layers.conv2d({
  filters: 128,
  kernelSize: 3,
  activation: 'relu',
  padding: 'same',
  name: 'conv2d_block3_1'
}))
model.add(tf.layers.conv2d({
  filters: 128,
  kernelSize: 3,
  activation: 'relu',
  padding: 'same',
  name: 'conv2d_block3_2'
}))
model.add(tf.layers.maxPooling2d({
  poolSize: 2,
  strides: 2,
  name: 'maxpool_block3'
}))
model.add(tf.layers.dropout({ rate: 0.25, name: 'dropout_block3' }))

// Flatten + Dense layers
model.add(tf.layers.flatten({ name: 'flatten' }))
model.add(tf.layers.dense({
  units: 512,
  activation: 'relu',
  name: 'dense_1'
}))
model.add(tf.layers.dropout({ rate: 0.5, name: 'dropout_dense' }))
model.add(tf.layers.dense({
  units: 151,  // 151 Pokemon!
  activation: 'softmax',
  name: 'output'
}))

console.log('📊 Arquitectura del modelo:')
model.summary()

// Guardar el modelo
const modelDir = path.join(process.cwd(), 'public', 'pokemon-model-151')
if (!fs.existsSync(modelDir)) {
  fs.mkdirSync(modelDir, { recursive: true })
}

// Compilar para inicializar pesos
model.compile({
  optimizer: 'adam',
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy']
})

console.log('\n💾 Guardando modelo...')

// Guardar usando el manejador de archivos personalizado
await model.save(tf.io.withSaveHandler(async (artifacts) => {
  // Guardar model.json
  const modelJson = {
    modelTopology: artifacts.modelTopology,
    format: 'layers-model',
    generatedBy: 'TensorFlow.js',
    convertedBy: null,
    weightsManifest: [{
      paths: ['weights.bin'],
      weights: artifacts.weightSpecs
    }]
  }
  
  fs.writeFileSync(
    path.join(modelDir, 'model.json'),
    JSON.stringify(modelJson, null, 2)
  )
  
  // Guardar weights.bin
  fs.writeFileSync(
    path.join(modelDir, 'weights.bin'),
    Buffer.from(artifacts.weightData)
  )
  
  // Guardar metadata
  const metadata = {
    numClasses: 151,
    imageSize: 224,
    classes: Array.from({ length: 151 }, (_, i) => i + 1),
    description: 'Modelo CNN para clasificar 151 Pokemon',
    created: new Date().toISOString(),
    version: '2.0.0'
  }
  
  fs.writeFileSync(
    path.join(modelDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2)
  )
  
  console.log('✅ Modelo guardado en:', modelDir)
  console.log('📄 Archivos creados:')
  console.log('   - model.json')
  console.log('   - weights.bin')
  console.log('   - metadata.json')
}))

console.log('\n📝 NOTA: Este modelo tiene pesos aleatorios.')
console.log('   Para entrenarlo, ejecuta: npm run train:real')
console.log('   (Script de entrenamiento será creado en la próxima sesión)')
