#!/usr/bin/env python3
"""
Conversión manual a TensorFlow.js - Formato compatible
"""
import os
import json
import numpy as np
import tensorflow as tf

def convert_manual():
    print("🔄 Iniciando conversión manual...")
    
    # Cargar modelo
    model = tf.keras.models.load_model('training/model/pokemon_cnn_model.h5')
    print(f"✅ Modelo cargado: {model.name}")
    
    # Crear directorio
    os.makedirs('pokemon-model', exist_ok=True)
    
    # Guardar pesos en formato binario
    weights = model.get_weights()
    print(f"🔄 Procesando {len(weights)} tensores...")
    
    # Crear manifest de pesos
    weight_manifest = []
    weight_data = []
    
    for i, w in enumerate(weights):
        weight_manifest.append({
            "name": f"w{i}",
            "shape": list(w.shape),
            "dtype": "float32"
        })
        weight_data.append(w.astype(np.float32).flatten())
    
    # Concatenar y guardar
    all_weights = np.concatenate(weight_data)
    all_weights.tofile('pokemon-model/weights.bin')
    
    print(f"✅ Pesos guardados: {all_weights.size:,} valores")
    
    # Crear model.json compatible
    # NOTA: Para un modelo MobileNetV2 complejo, necesitamos un formato específico
    model_json = {
        "modelTopology": {
            "class_name": "Functional",  # MobileNet es funcional, no secuencial
            "config": model.get_config()
        },
        "weightsManifest": [{
            "paths": ["weights.bin"],
            "weights": weight_manifest
        }]
    }
    
    with open('pokemon-model/model.json', 'w') as f:
        json.dump(model_json, f, indent=2)
    
    print("✅ model.json creado")
    
    # Metadata
    metadata = {
        "version": "1.0",
        "num_classes": 151,
        "image_size": 224,
        "converted_at": str(np.datetime64('now'))
    }
    
    with open('pokemon-model/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("✅ Conversión completada")
    return True

if __name__ == '__main__':
    try:
        convert_manual()
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
