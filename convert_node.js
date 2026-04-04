const tf = require('@tensorflow/tfjs');
const tfc = require('@tensorflow/tfjs-converter');
const fs = require('fs');
const path = require('path');

async function convertModel() {
  console.log('🔄 Convirtiendo modelo Keras a TensorFlow.js...');
  
  const modelPath = 'training/model/pokemon_cnn_model.h5';
  const outputDir = 'pokemon-model';
  
  if (!fs.existsSync(modelPath)) {
    console.error('❌ Modelo no encontrado:', modelPath);
    return;
  }
  
  try {
    // Cargar modelo
    console.log('📂 Cargando modelo...');
    const model = await tf.loadLayersModel(`file://${path.resolve(modelPath)}`);
    
    console.log('✅ Modelo cargado');
    console.log('   Capas:', model.layers.length);
    
    // Crear directorio
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Guardar en formato TF.js
    console.log('🔄 Guardando en formato TF.js...');
    await model.save(`file://${path.resolve(outputDir)}`);
    
    console.log('✅ Modelo convertido exitosamente!');
    console.log('📁 Guardado en:', outputDir);
    
    // Verificar archivos
    const files = fs.readdirSync(outputDir);
    console.log('   Archivos:', files.join(', '));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

convertModel();
