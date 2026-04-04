#!/usr/bin/env python3
"""Convertir modelo Keras a TensorFlow.js"""

import os
import sys

# Agregar site-packages al path
import site
site_packages = site.getsitepackages()[0]
sys.path.insert(0, site_packages)

try:
    import tensorflow as tf
    import tensorflowjs as tfjs
    
    print("🔄 Convirtiendo modelo a TensorFlow.js...")
    
    # Cargar modelo
    model = tf.keras.models.load_model('training/model/pokemon_cnn_model.h5')
    
    # Crear directorio
    os.makedirs('pokemon-model', exist_ok=True)
    
    # Convertir
    tfjs.converters.save_keras_model(model, 'pokemon-model/')
    
    print("✅ Conversión completada!")
    print("📁 Modelo guardado en: pokemon-model/")
    
    # Crear metadata
    import json
    metadata = {
        'version': '1.0',
        'num_classes': 151,
        'image_size': 224,
        'model_type': 'cnn_mobilenet',
        'description': 'Modelo CNN para reconocimiento de 151 Pokémon'
    }
    
    with open('pokemon-model/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("✅ Metadata guardada")
    
except ImportError as e:
    print(f"❌ Error de importación: {e}")
    print("Instalando tensorflowjs...")
    os.system(f'{sys.executable} -m pip install tensorflowjs')
    print("Por favor, ejecuta este script nuevamente")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
