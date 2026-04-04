#!/usr/bin/env python3
"""
Conversión manual del modelo Keras a TensorFlow.js
Sin usar tensorflowjs package
"""

import os
import json
import numpy as np
import tensorflow as tf

def convert_to_tfjs_manual():
    print("🔄 Convirtiendo modelo manualmente...")
    
    # Cargar modelo
    model_path = 'training/model/pokemon_cnn_model.h5'
    if not os.path.exists(model_path):
        print(f"❌ Modelo no encontrado: {model_path}")
        return False
    
    model = tf.keras.models.load_model(model_path)
    print(f"✅ Modelo cargado: {model.name}")
    print(f"   Capas: {len(model.layers)}")
    print(f"   Parámetros: {model.count_params():,}")
    
    # Crear directorio
    output_dir = 'pokemon-model'
    os.makedirs(output_dir, exist_ok=True)
    
    # Guardar weights manualmente
    weights = model.get_weights()
    
    # Guardar cada weight como archivo binario separado
    weight_manifest = []
    for i, w in enumerate(weights):
        weight_file = f'weights_{i}.bin'
        weight_path = os.path.join(output_dir, weight_file)
        w.astype(np.float32).tofile(weight_path)
        
        weight_manifest.append({
            'name': weight_file,
            'shape': list(w.shape),
            'dtype': 'float32'
        })
        print(f"   Guardado: {weight_file} {w.shape}")
    
    # Crear archivo model.json compatible con TFJS
    model_json = {
        'modelTopology': {
            'model_config': model.get_config()
        },
        'weightsManifest': [{
            'paths': [w['name'] for w in weight_manifest],
            'weights': weight_manifest
        }]
    }
    
    # Guardar model.json
    model_json_path = os.path.join(output_dir, 'model.json')
    with open(model_json_path, 'w') as f:
        json.dump(model_json, f, indent=2)
    
    print(f"✅ model.json guardado")
    
    # Crear metadata
    metadata = {
        'version': '1.0',
        'num_classes': 151,
        'image_size': 224,
        'model_type': 'cnn_mobilenet',
        'description': 'Modelo CNN para reconocimiento de 151 Pokémon',
        'converted_manually': True
    }
    
    metadata_path = os.path.join(output_dir, 'metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"✅ metadata.json guardado")
    print(f"\n📁 Archivos en: {output_dir}/")
    
    return True

if __name__ == '__main__':
    print("=" * 50)
    print("  🔄 CONVERSIÓN MANUAL A TENSORFLOW.JS")
    print("=" * 50)
    print()
    
    if convert_to_tfjs_manual():
        print("\n✅ Conversión completada!")
        print("\n⚠️  Nota: Esta es una conversión manual básica.")
        print("   Para cargar en el navegador, necesitarás usar")
    else:
        print("\n❌ Conversión fallida")
