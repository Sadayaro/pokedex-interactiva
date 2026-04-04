#!/usr/bin/env python3
"""
Conversión manual compatible con TensorFlow.js
Crea un modelo.json válido para TF.js
"""

import os
import json
import numpy as np
import tensorflow as tf

def create_tfjs_compatible_model():
    print("=" * 60)
    print("  🔄 CONVERSIÓN MANUAL A TENSORFLOW.JS")
    print("=" * 60)
    print()
    
    # Cargar modelo
    model_path = 'training/model/pokemon_cnn_model.h5'
    print(f"📂 Cargando modelo: {model_path}")
    model = tf.keras.models.load_model(model_path)
    
    print(f"✅ Modelo cargado: {model.name}")
    print(f"   Capas: {len(model.layers)}")
    print()
    
    # Crear directorio
    output_dir = 'pokemon-model'
    os.makedirs(output_dir, exist_ok=True)
    
    # Para TensorFlow.js, necesitamos crear un modelo compatible
    # Vamos a guardar solo los pesos y crear una arquitectura compatible
    
    # Obtener pesos
    weights = model.get_weights()
    print(f"🔄 Guardando {len(weights)} tensores de pesos...")
    
    # Guardar pesos en formato binario
    weight_shapes = []
    weight_data = []
    
    for i, w in enumerate(weights):
        shape = list(w.shape)
        weight_shapes.append(shape)
        weight_data.append(w.astype(np.float32))
    
    # Concatenar todos los pesos en un solo buffer
    # Calcular offsets
    offsets = []
    current_offset = 0
    for w in weight_data:
        offsets.append(current_offset)
        current_offset += w.size * 4  # float32 = 4 bytes
    
    # Crear buffer único
    combined_buffer = np.concatenate([w.flatten() for w in weight_data])
    
    # Guardar archivo de pesos
    weights_file = 'group1-shard1of1.bin'
    weights_path = os.path.join(output_dir, weights_file)
    combined_buffer.astype(np.float32).tofile(weights_path)
    
    print(f"✅ Pesos guardados: {weights_file} ({combined_buffer.size * 4 / 1024 / 1024:.2f} MB)")
    
    # Crear manifest de pesos con información de cada tensor
    weights_manifest = []
    for i, (shape, offset) in enumerate(zip(weight_shapes, offsets)):
        size = int(np.prod(shape))
        weights_manifest.append({
            "name": f"weight_{i}",
            "shape": shape,
            "dtype": "float32",
            "offset": offset,
            "size": size * 4  # bytes
        })
    
    # Crear model.json compatible con TF.js Layers format
    # NOTA: Esto es una simplificación. Para un modelo real MobileNetV2,
    # necesitaríamos recrear la arquitectura exacta en TF.js
    
    model_json = {
        "modelTopology": {
            "class_name": "Sequential",
            "config": {
                "name": "pokemon_cnn",
                "layers": []
            },
            "keras_version": "2.15.0",
            "backend": "tensorflow"
        },
        "weightsManifest": [
            {
                "paths": [weights_file],
                "weights": weights_manifest
            }
        ]
    }
    
    # Guardar model.json
    model_json_path = os.path.join(output_dir, 'model.json')
    with open(model_json_path, 'w') as f:
        json.dump(model_json, f, indent=2)
    
    print(f"✅ Modelo JSON guardado: model.json")
    
    # Guardar metadata adicional
    metadata = {
        "version": "1.0",
        "num_classes": 151,
        "image_size": 224,
        "model_type": "cnn_mobilenet",
        "description": "Modelo CNN para reconocimiento de 151 Pokémon",
        "num_weights": len(weights),
        "converted_at": str(np.datetime64('now'))
    }
    
    metadata_path = os.path.join(output_dir, 'metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"✅ Metadata guardada: metadata.json")
    
    # Guardar información de la arquitectura para referencia
    arch_info = []
    for i, layer in enumerate(model.layers):
        config = layer.get_config()
        arch_info.append({
            "index": i,
            "name": layer.name,
            "class_name": layer.__class__.__name__,
            "input_shape": str(layer.input_shape) if hasattr(layer, 'input_shape') else None,
            "output_shape": str(layer.output_shape) if hasattr(layer, 'output_shape') else None,
            "num_params": layer.count_params()
        })
    
    arch_path = os.path.join(output_dir, 'architecture.json')
    with open(arch_path, 'w') as f:
        json.dump(arch_info, f, indent=2)
    
    print(f"✅ Arquitectura guardada: architecture.json")
    
    print()
    print("=" * 60)
    print("  ✅ CONVERSIÓN COMPLETADA")
    print("=" * 60)
    print(f"\n📁 Archivos en: {output_dir}/")
    print(f"   - model.json (configuración)")
    print(f"   - {weights_file} (pesos)")
    print(f"   - metadata.json (metadatos)")
    print(f"   - architecture.json (info de capas)")
    print()
    print("⚠️  IMPORTANTE: Este modelo usa conversión manual.")
    print("   Para usar en la app, necesitarás cargar los pesos")
    print("   y construir la arquitectura manualmente en TF.js")
    
    return True

if __name__ == '__main__':
    try:
        create_tfjs_compatible_model()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
