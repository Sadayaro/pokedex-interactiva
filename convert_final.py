#!/usr/bin/env python3
"""
Conversión manual a formato TensorFlow.js Layers
Compatible con tf.loadLayersModel()
"""

import os
import json
import numpy as np
import tensorflow as tf

def convert_to_tfjs():
    print("=" * 60)
    print("  🔄 CONVERSIÓN MANUAL A TENSORFLOW.JS")
    print("=" * 60)
    
    # Cargar modelo
    model_path = 'training/model/pokemon_cnn_model.h5'
    print(f"\n📂 Cargando: {model_path}")
    
    if not os.path.exists(model_path):
        print(f"❌ Modelo no encontrado")
        return False
    
    model = tf.keras.models.load_model(model_path)
    print(f"✅ Modelo cargado: {model.name}")
    print(f"   Capas: {len(model.layers)}")
    print(f"   Parámetros: {model.count_params():,}")
    
    # Crear directorio de salida
    output_dir = 'pokemon-model'
    os.makedirs(output_dir, exist_ok=True)
    
    # Obtener configuración del modelo en formato TF.js compatible
    model_config = model.get_config()
    
    # Convertir configuración a formato TF.js
    # TF.js espera un formato específico
    tfjs_config = {
        "class_name": "Sequential",
        "config": {
            "name": model.name,
            "layers": []
        }
    }
    
    # Procesar cada capa
    for layer in model.layers:
        layer_config = layer.get_config()
        layer_class = layer.__class__.__name__
        
        # Mapear nombres de clase de Keras a TF.js
        class_mapping = {
            'InputLayer': 'input',
            'Conv2D': 'conv2d',
            'BatchNormalization': 'batchNormalization',
            'ReLU': 'reLU',
            'DepthwiseConv2D': 'depthwiseConv2d',
            'GlobalAveragePooling2D': 'globalAveragePooling2d',
            'Dropout': 'dropout',
            'Dense': 'dense',
            'Flatten': 'flatten',
            'MaxPooling2D': 'maxPooling2d',
            'AveragePooling2D': 'averagePooling2d',
            'Add': 'add',
            'Activation': 'activation',
            'Functional': 'functional'  # Para modelos funcionales como MobileNet
        }
        
        tfjs_class = class_mapping.get(layer_class, layer_class.lower())
        
        tfjs_config["config"]["layers"].append({
            "class_name": tfjs_class,
            "config": layer_config
        })
    
    # Guardar pesos
    print("\n🔄 Guardando pesos...")
    weights = model.get_weights()
    
    # Crear manifest de pesos
    weight_manifest = []
    weight_files = []
    
    # Agrupar pesos en shards de ~4MB
    shard_size = 4 * 1024 * 1024  # 4MB
    current_shard = []
    current_shard_size = 0
    shard_index = 0
    
    for i, weight in enumerate(weights):
        weight_bytes = weight.size * 4  # float32 = 4 bytes
        
        if current_shard_size + weight_bytes > shard_size and current_shard:
            # Guardar shard actual
            shard_file = f"group{shard_index}-shard1of1.bin"
            shard_path = os.path.join(output_dir, shard_file)
            
            combined = np.concatenate([w.flatten() for w in current_shard])
            combined.astype(np.float32).tofile(shard_path)
            
            weight_files.append(shard_file)
            shard_index += 1
            current_shard = [weight]
            current_shard_size = weight_bytes
        else:
            current_shard.append(weight)
            current_shard_size += weight_bytes
        
        weight_manifest.append({
            "name": f"weight_{i}",
            "shape": list(weight.shape),
            "dtype": "float32"
        })
    
    # Guardar último shard
    if current_shard:
        shard_file = f"group{shard_index}-shard1of1.bin"
        shard_path = os.path.join(output_dir, shard_file)
        
        combined = np.concatenate([w.flatten() for w in current_shard])
        combined.astype(np.float32).tofile(shard_path)
        
        weight_files.append(shard_file)
    
    print(f"✅ Pesos guardados en {len(weight_files)} archivo(s)")
    
    # Crear model.json en formato TF.js Layers
    model_json = {
        "modelTopology": tfjs_config,
        "weightsManifest": [{
            "paths": weight_files,
            "weights": weight_manifest
        }]
    }
    
    # Guardar model.json
    model_json_path = os.path.join(output_dir, 'model.json')
    with open(model_json_path, 'w') as f:
        json.dump(model_json, f, indent=2)
    
    print(f"✅ Modelo JSON guardado: {model_json_path}")
    
    # Guardar metadata
    metadata = {
        "version": "1.0",
        "num_classes": 151,
        "image_size": 224,
        "model_type": "cnn_mobilenet",
        "description": "Modelo CNN para reconocimiento de 151 Pokémon",
        "converted_at": str(np.datetime64('now')),
        "tensorflow_version": tf.__version__
    }
    
    metadata_path = os.path.join(output_dir, 'metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"✅ Metadata guardada: {metadata_path}")
    
    print("\n" + "=" * 60)
    print("  ✅ CONVERSIÓN COMPLETADA")
    print("=" * 60)
    print(f"\n📁 Archivos en: {output_dir}/")
    for f in os.listdir(output_dir):
        size = os.path.getsize(os.path.join(output_dir, f))
        print(f"   - {f} ({size:,} bytes)")
    
    return True

if __name__ == '__main__':
    try:
        success = convert_to_tfjs()
        exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
