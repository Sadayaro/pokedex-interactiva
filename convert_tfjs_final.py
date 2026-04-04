#!/usr/bin/env python3
"""
Script de conversión con manejo de dependencias
"""
import sys
import os

# Ajustar path para evitar conflictos
sys.path.insert(0, os.path.expanduser('~\\AppData\\Roaming\\Python\\Python311\\site-packages'))

try:
    import tensorflow as tf
    import tensorflowjs as tfjs
    
    print("🔄 Cargando modelo...")
    model = tf.keras.models.load_model('training/model/pokemon_cnn_model.h5')
    print(f"✅ Modelo cargado: {model.name}")
    
    print("🔄 Convirtiendo a TensorFlow.js...")
    tfjs.converters.save_keras_model(model, 'pokemon-model/')
    print("✅ Conversión completada!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
