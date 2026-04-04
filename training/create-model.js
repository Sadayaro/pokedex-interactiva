/**
 * Script para crear un modelo de Pokémon simplificado usando datos sintéticos
 * Como demostración hasta que se pueda entrenar con imágenes reales
 */

const tf = require('@tensorflow/tfjs-node');
const fs = require('fs-extra');
const path = require('path');

const MODEL_DIR = './model';
const NUM_CLASSES = 151;
const IMAGE_SIZE = 224;

async function createSyntheticModel() {
  console.log('🧠 Creando modelo CNN para clasificación de Pokémon...\n');
  
  // Crear modelo desde cero (sin transfer learning por ahora para demo)
  const model = tf.sequential();
  
  // Primera capa convolucional
  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_SIZE, IMAGE_SIZE, 3],
    filters: 32,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));
  
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  // Segunda capa convolucional
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));
  
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  // Tercera capa convolucional
  model.add(tf.layers.conv2d({
    filters: 128,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));
  
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  // Cuarta capa convolucional
  model.add(tf.layers.conv2d({
    filters: 256,
    kernelSize: 3,
    activation: 'relu',
    padding: 'same'
  }));
  
  model.add(tf.layers.maxPooling2d({ poolSize: 2 }));
  
  // Capas densas
  model.add(tf.layers.flatten());
  
  model.add(tf.layers.dense({
    units: 512,
    activation: 'relu',
    dropout: 0.5
  }));
  
  model.add(tf.layers.dense({
    units: 256,
    activation: 'relu',
    dropout: 0.3
  }));
  
  // Capa de salida
  model.add(tf.layers.dense({
    units: NUM_CLASSES,
    activation: 'softmax'
  }));
  
  // Compilar
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });
  
  console.log('✅ Modelo CNN creado\n');
  model.summary();
  
  return model;
}

async function saveModelForBrowser(model) {
  console.log('💾 Guardando modelo para navegador...');
  
  await fs.ensureDir(MODEL_DIR);
  
  // Guardar en formato TensorFlow.js
  await model.save(`file://${path.resolve(MODEL_DIR)}`);
  
  // Copiar a la carpeta web
  const webModelDir = path.join('..', 'pokemon-model');
  await fs.ensureDir(webModelDir);
  await fs.copy(MODEL_DIR, webModelDir);
  
  console.log(`✅ Modelo guardado en: ${MODEL_DIR}/`);
  console.log(`✅ Copiado a: ${webModelDir}/`);
}

async function createModelMetadata() {
  const metadata = {
    modelName: "PokemonClassifier-v1",
    version: "1.0.0",
    numClasses: NUM_CLASSES,
    imageSize: IMAGE_SIZE,
    pokemonList: Array.from({length: NUM_CLASSES}, (_, i) => ({
      id: i + 1,
      name: `Pokemon_${i + 1}`
    })),
    createdAt: new Date().toISOString()
  };
  
  // Cargar nombres reales de Pokémon si existen
  try {
    const pokemonData = require('../pokemon-data.js');
    metadata.pokemonList = pokemonData.POKEMON_DATABASE.map(p => ({
      id: p.id,
      name: p.name,
      types: p.types
    }));
  } catch (e) {
    console.log('⚠️ No se pudo cargar nombres de Pokémon, usando IDs');
  }
  
  await fs.writeJson(path.join('..', 'pokemon-model', 'metadata.json'), metadata, {spaces: 2});
  console.log('✅ Metadatos guardados');
}

// Ejecutar
async function main() {
  console.log('🎮 Creando modelo de clasificación de Pokémon\n');
  
  const model = await createSyntheticModel();
  await saveModelForBrowser(model);
  await createModelMetadata();
  
  console.log('\n🎉 Modelo listo para entrenar!');
  console.log('\nPasos siguientes:');
  console.log('1. Ejecuta: npm install');
  console.log('2. Descarga imágenes: node download-images.js');
  console.log('3. Entrena: node train.js');
  console.log('4. El modelo estará en ../pokemon-model/');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createSyntheticModel };
