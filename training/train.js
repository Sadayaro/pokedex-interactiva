/**
 * Entrenamiento de modelo CNN para clasificación de 151 Pokémon
 * Usa Transfer Learning desde MobileNet
 */

const tf = require('@tensorflow/tfjs-node');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

const DATASET_DIR = './dataset';
const MODEL_DIR = './model';
const IMAGE_SIZE = 224; // Tamaño de entrada de MobileNet
const NUM_CLASSES = 151; // 151 Pokémon Gen 1
const BATCH_SIZE = 32;
const EPOCHS = 50;
const VALIDATION_SPLIT = 0.2;

// Cargar y preprocesar imagen
async function loadAndPreprocessImage(imagePath) {
  // Usar sharp para redimensionar y procesar imagen
  const buffer = await sharp(imagePath)
    .resize(IMAGE_SIZE, IMAGE_SIZE, { fit: 'fill' })
    .raw()
    .toBuffer();
  
  // Convertir a tensor [224, 224, 3]
  const tensor = tf.tensor3d(buffer, [IMAGE_SIZE, IMAGE_SIZE, 3])
    .div(255.0) // Normalizar a 0-1
    .expandDims(0); // Añadir batch dimension
  
  return tensor;
}

// Cargar dataset completo
async function loadDataset() {
  console.log('📂 Cargando dataset...');
  
  const images = [];
  const labels = [];
  
  for (let id = 1; id <= NUM_CLASSES; id++) {
    const pokemonDir = path.join(DATASET_DIR, String(id));
    
    if (!(await fs.pathExists(pokemonDir))) {
      console.warn(`⚠️  No se encontró directorio para Pokémon #${id}`);
      continue;
    }
    
    const files = await fs.readdir(pokemonDir);
    const imageFiles = files.filter(f => f.endsWith('.png') || f.endsWith('.jpg'));
    
    for (const file of imageFiles) {
      const imagePath = path.join(pokemonDir, file);
      images.push(imagePath);
      labels.push(id - 1); // 0-indexed
    }
    
    if (id % 20 === 0) {
      console.log(`  ✓ Cargado Pokémon #${id}: ${imageFiles.length} imágenes`);
    }
  }
  
  console.log(`✅ Total: ${images.length} imágenes\n`);
  return { images, labels };
}

// Crear modelo con Transfer Learning
async function createModel() {
  console.log('🧠 Creando modelo con Transfer Learning (MobileNet)...\n');
  
  // Cargar MobileNet pre-entrenado
  const mobilenet = await tf.loadLayersModel(
    'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json'
  );
  
  // Congelar capas base
  mobilenet.layers.forEach(layer => {
    layer.trainable = false;
  });
  
  // Crear nuevo modelo
  const model = tf.sequential();
  
  // Añadir capas de MobileNet (excepto la última)
  for (let i = 0; i < mobilenet.layers.length - 1; i++) {
    model.add(mobilenet.layers[i]);
  }
  
  // Añadir nuevas capas para clasificación de Pokémon
  model.add(tf.layers.flatten());
  
  model.add(tf.layers.dense({
    units: 512,
    activation: 'relu',
    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
  }));
  
  model.add(tf.layers.dropout({ rate: 0.5 }));
  
  model.add(tf.layers.dense({
    units: 256,
    activation: 'relu',
    kernelRegularizer: tf.regularizers.l2({ l2: 0.001 })
  }));
  
  model.add(tf.layers.dropout({ rate: 0.3 }));
  
  // Capa de salida: 151 clases (Pokémon)
  model.add(tf.layers.dense({
    units: NUM_CLASSES,
    activation: 'softmax'
  }));
  
  // Compilar modelo
  model.compile({
    optimizer: tf.train.adam(0.0001),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy']
  });
  
  console.log('✅ Modelo creado\n');
  model.summary();
  
  return model;
}

// Generador de datos para entrenamiento
async function* dataGenerator(images, labels, isTraining = true) {
  const numSamples = images.length;
  let indices = Array.from({length: numSamples}, (_, i) => i);
  
  // Split train/validation
  const splitIdx = Math.floor(numSamples * (1 - VALIDATION_SPLIT));
  indices = isTraining ? indices.slice(0, splitIdx) : indices.slice(splitIdx);
  
  // Shuffle para entrenamiento
  if (isTraining) {
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
  }
  
  let batchImages = [];
  let batchLabels = [];
  
  for (const idx of indices) {
    const imageTensor = await loadAndPreprocessImage(images[idx]);
    batchImages.push(imageTensor);
    batchLabels.push(labels[idx]);
    
    if (batchImages.length === BATCH_SIZE) {
      const xs = tf.concat(batchImages, 0);
      const ys = tf.tensor1d(batchLabels, 'int32');
      
      yield { xs, ys };
      
      batchImages.forEach(t => t.dispose());
      batchImages = [];
      batchLabels = [];
    }
  }
  
  // Último batch si queda
  if (batchImages.length > 0) {
    const xs = tf.concat(batchImages, 0);
    const ys = tf.tensor1d(batchLabels, 'int32');
    yield { xs, ys };
    batchImages.forEach(t => t.dispose());
  }
}

// Entrenar modelo
async function trainModel() {
  console.log('🚀 Iniciando entrenamiento...\n');
  
  const { images, labels } = await loadDataset();
  
  if (images.length === 0) {
    console.error('❌ No se encontraron imágenes. Ejecuta primero: node download-images.js');
    return;
  }
  
  const model = await createModel();
  
  // Calcular pasos por época
  const numTrainSamples = Math.floor(images.length * (1 - VALIDATION_SPLIT));
  const stepsPerEpoch = Math.ceil(numTrainSamples / BATCH_SIZE);
  const validationSteps = Math.ceil((images.length - numTrainSamples) / BATCH_SIZE);
  
  console.log(`\n📊 Configuración:`);
  console.log(`   Muestras de entrenamiento: ${numTrainSamples}`);
  console.log(`   Muestras de validación: ${images.length - numTrainSamples}`);
  console.log(`   Batch size: ${BATCH_SIZE}`);
  console.log(`   Épocas: ${EPOCHS}`);
  console.log(`   Pasos por época: ${stepsPerEpoch}\n`);
  
  // Entrenar
  const history = await model.fitGenerator(
    () => dataGenerator(images, labels, true),
    {
      stepsPerEpoch,
      epochs: EPOCHS,
      validationData: () => dataGenerator(images, labels, false),
      validationSteps,
      callbacks: [
        tf.callbacks.earlyStopping({
          monitor: 'val_accuracy',
          patience: 10,
          restoreBestWeights: true
        }),
        {
          onEpochEnd: (epoch, logs) => {
            console.log(
              `Época ${epoch + 1}/${EPOCHS} - ` +
              `loss: ${logs.loss.toFixed(4)} - ` +
              `accuracy: ${(logs.acc * 100).toFixed(2)}% - ` +
              `val_accuracy: ${(logs.val_acc * 100).toFixed(2)}%`
            );
          }
        }
      ]
    }
  );
  
  // Guardar modelo
  await fs.ensureDir(MODEL_DIR);
  await model.save(`file://${path.resolve(MODEL_DIR)}`);
  
  console.log('\n✅ Entrenamiento completado!');
  console.log(`📁 Modelo guardado en: ${MODEL_DIR}/`);
  console.log(`🎯 Accuracy final: ${(history.history.acc[history.history.acc.length - 1] * 100).toFixed(2)}%`);
}

// Ejecutar
if (require.main === module) {
  trainModel().catch(err => {
    console.error('❌ Error en entrenamiento:', err);
    process.exit(1);
  });
}

module.exports = { trainModel, createModel };
