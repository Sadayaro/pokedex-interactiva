const tf = require('@tensorflow/tfjs');
const tfc = require('@tensorflow/tfjs-converter');
const fs = require('fs');
const path = require('path');

async function convertModel() {
  console.log('🔄 Iniciando conversión del modelo...');
  
  const modelPath = path.resolve('training/model/pokemon_cnn_model.h5');
  const outputDir = path.resolve('pokemon-model');
  
  if (!fs.existsSync(modelPath)) {
    console.error('❌ Modelo no encontrado:', modelPath);
    return;
  }
  
  try {
    // Cargar modelo
    console.log('📂 Cargando modelo Keras...');
    const model = await tf.loadLayersModel(`file://${modelPath}`);
    
    console.log('✅ Modelo cargado');
    console.log('   Capas:', model.layers.length);
    
    // Crear directorio
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Guardar en formato TF.js
    console.log('🔄 Guardando en formato TF.js Layers...');
    await model.save(`file://${outputDir}`);
    
    console.log('✅ Conversión completada!');
    console.log('📁 Archivos guardados en:', outputDir);
    
    // Verificar archivos
    const files = fs.readdirSync(outputDir);
    console.log('   Archivos:', files.join(', '));
    
    // Crear metadata
    const metadata = {
      version: '1.0',
      num_classes: 151,
      image_size: 224,
      model_type: 'cnn_mobilenet',
      description: 'Modelo CNN para reconocimiento de 151 Pokémon',
      converted_at: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(outputDir, 'metadata.json'),
      JSON.stringify(metadata, null, 2)
    );
    
    console.log('✅ Metadata guardada');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

convertModel();
