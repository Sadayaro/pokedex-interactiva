import * as tf from '@tensorflow/tfjs'
import * as fs from 'fs'
import * as path from 'path'
import sharp from 'sharp'

console.log('🧠 Script de Entrenamiento CNN - 151 Pokemon')
console.log('=' .repeat(60))

// Configuración
const CONFIG = {
  imageSize: 224,
  numClasses: 151,
  batchSize: 32,
  epochs: 50,
  learningRate: 0.0001,
  validationSplit: 0.2,
  datasetDir: path.join(process.cwd(), 'dataset'),
  modelDir: path.join(process.cwd(), 'public', 'pokemon-model')
}

// Verificar que existe el dataset
if (!fs.existsSync(CONFIG.datasetDir)) {
  console.error('❌ Error: No se encontró el directorio dataset/')
  console.error('   Ejecuta primero: node scripts/download-images.js')
  process.exit(1)
}

// Función para cargar y procesar imágenes
async function loadImage(imagePath) {
  try {
    // Usar sharp para redimensionar y normalizar
    const buffer = await sharp(imagePath)
      .resize(CONFIG.imageSize, CONFIG.imageSize)
      .removeAlpha()
      .raw()
      .toBuffer()
    
    // Convertir a tensor y normalizar (0-1)
    const tensor = tf.tensor3d(buffer, [CONFIG.imageSize, CONFIG.imageSize, 3])
    return tensor.div(255.0)
  } catch (err) {
    return null
  }
}

// Función para cargar el dataset completo
async function loadDataset() {
  console.log('\n📂 Cargando dataset...')
  
  const images = []
  const labels = []
  
  const pokemonDirs = fs.readdirSync(CONFIG.datasetDir)
    .filter(dir => /^\d{3}$/.test(dir))  // Solo directorios con formato 001, 002, etc.
    .sort()
  
  console.log(`   Encontrados ${pokemonDirs.length} directorios de Pokemon`)
  
  for (const dir of pokemonDirs) {
    const pokemonId = parseInt(dir)
    const pokemonDir = path.join(CONFIG.datasetDir, dir)
    
    const imageFiles = fs.readdirSync(pokemonDir)
      .filter(f => f.endsWith('.png') || f.endsWith('.jpg'))
    
    console.log(`   Pokemon ${dir}: ${imageFiles.length} imágenes`)
    
    for (const imageFile of imageFiles) {
      const imagePath = path.join(pokemonDir, imageFile)
      const imageTensor = await loadImage(imagePath)
      
      if (imageTensor) {
        images.push(imageTensor)
        labels.push(pokemonId - 1)  // Clases 0-150
      }
    }
  }
  
  console.log(`\n📊 Dataset cargado:`)
  console.log(`   - Total imágenes: ${images.length}`)
  console.log(`   - Clases: ${new Set(labels).size}`)
  
  return { images, labels }
}

// Crear modelo CNN
function createModel() {
  console.log('\n🏗️  Creando modelo CNN...')
  
  const model = tf.sequential()
  
  // Bloque 1
  model.add(tf.layers.conv2d({
    inputShape: [CONFIG.imageSize, CONFIG.imageSize, 3],
    filters: 32,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }))
  model.add(tf.layers.conv2d({
    filters: 32,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }))
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }))
  model.add(tf.layers.dropout({ rate: 0.25 }))
  
  // Bloque 2
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }))
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }))
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }))
  model.add(tf.layers.dropout({ rate: 0.25 }))
  
  // Bloque 3
  model.add(tf.layers.conv2d({
    filters: 128,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }))
  model.add(tf.layers.conv2d({
    filters: 128,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }))
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }))
  model.add(tf.layers.dropout({ rate: 0.25 }))
  
  // Clasificador
  model.add(tf.layers.flatten())
  model.add(tf.layers.dense({ units: 512, activation: 'relu' }))
  model.add(tf.layers.dropout({ rate: 0.5 }))
  model.add(tf.layers.dense({
    units: CONFIG.numClasses,
    activation: 'softmax'
  }))
  
  model.compile({
    optimizer: tf.train.adam(CONFIG.learningRate),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy']
  })
  
  model.summary()
  
  return model
}

// Entrenar el modelo
async function train() {
  console.log('\n' + '='.repeat(60))
  console.log('🚀 INICIANDO ENTRENAMIENTO')
  console.log('='.repeat(60))
  
  // Cargar datos
  const { images, labels } = await loadDataset()
  
  if (images.length === 0) {
    console.error('❌ No se encontraron imágenes para entrenar')
    console.error('   Asegúrate de ejecutar el script de descarga primero')
    process.exit(1)
  }
  
  if (images.length < 100) {
    console.warn('\n⚠️  ADVERTENCIA: Pocas imágenes para entrenar (menos de 100)')
    console.warn('   El modelo no tendrá buena precisión')
    console.warn('   Considera obtener más imágenes de cada Pokemon')
  }
  
  // Convertir a tensores
  const xs = tf.stack(images)
  const ys = tf.tensor1d(labels, 'int32')
  
  console.log(`\n📊 Datos preparados:`)
  console.log(`   - X shape: ${xs.shape}`)
  console.log(`   - Y shape: ${ys.shape}`)
  
  // Crear y entrenar modelo
  const model = createModel()
  
  console.log(`\n⏱️  Tiempo estimado: ~${Math.round(images.length * CONFIG.epochs / 60)} minutos`)
  console.log('   (Presiona Ctrl+C para cancelar)\n')
  
  // Entrenar
  const startTime = Date.now()
  
  await model.fit(xs, ys, {
    epochs: CONFIG.epochs,
    batchSize: CONFIG.batchSize,
    validationSplit: CONFIG.validationSplit,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
        console.log(
          `   Epoch ${epoch + 1}/${CONFIG.epochs} - ` +
          `loss: ${logs.loss.toFixed(4)} - ` +
          `acc: ${logs.acc.toFixed(4)} - ` +
          `val_loss: ${logs.val_loss?.toFixed(4) || 'N/A'} - ` +
          `val_acc: ${logs.val_acc?.toFixed(4) || 'N/A'} - ` +
          `${elapsed}min`
        )
      }
    }
  })
  
  // Guardar modelo
  console.log('\n💾 Guardando modelo entrenado...')
  
  if (!fs.existsSync(CONFIG.modelDir)) {
    fs.mkdirSync(CONFIG.modelDir, { recursive: true })
  }
  
  await model.save(tf.io.withSaveHandler(async (artifacts) => {
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
      path.join(CONFIG.modelDir, 'model.json'),
      JSON.stringify(modelJson, null, 2)
    )
    
    fs.writeFileSync(
      path.join(CONFIG.modelDir, 'weights.bin'),
      Buffer.from(artifacts.weightData)
    )
    
    const metadata = {
      numClasses: CONFIG.numClasses,
      imageSize: CONFIG.imageSize,
      trainedImages: images.length,
      epochs: CONFIG.epochs,
      accuracy: 'Ver en logs de entrenamiento',
      created: new Date().toISOString(),
      version: '3.0.0-trained'
    }
    
    fs.writeFileSync(
      path.join(CONFIG.modelDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    )
    
    console.log('✅ Modelo guardado en:', CONFIG.modelDir)
  }))
  
  // Limpiar memoria
  xs.dispose()
  ys.dispose()
  model.dispose()
  
  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1)
  
  console.log('\n' + '='.repeat(60))
  console.log('✅ ENTRENAMIENTO COMPLETADO')
  console.log('='.repeat(60))
  console.log(`\n📊 Resumen:`)
  console.log(`   - Imágenes entrenadas: ${images.length}`)
  console.log(`   - Épocas: ${CONFIG.epochs}`)
  console.log(`   - Tiempo total: ${totalTime} minutos`)
  console.log(`\n📝 Próximo paso:`)
  console.log(`   Ejecuta: npm run build && git add -A && git commit -m "Add trained CNN model" && git push`)
  console.log(`   Luego haz deploy en Vercel`)
}

// Ejecutar
train().catch(err => {
  console.error('\n❌ Error durante el entrenamiento:', err)
  process.exit(1)
})
