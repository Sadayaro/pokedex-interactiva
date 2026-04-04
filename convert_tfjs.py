#!/usr/bin/env python3
"""Convertir modelo Keras a TensorFlow.js Layers format"""

import os
import sys
import json
import numpy as np

def convert_model():
    print("🔄 Iniciando conversión del modelo...")
    
    # Verificar que existe el modelo
    model_path = 'training/model/pokemon_cnn_model.h5'
    if not os.path.exists(model_path):
        print(f"❌ Modelo no encontrado: {model_path}")
        return False
    
    try:
        import tensorflow as tf
        print(f"✅ TensorFlow {tf.__version__} cargado")
        
        # Cargar modelo
        print("📂 Cargando modelo Keras...")
        model = tf.keras.models.load_model(model_path)
        print(f"   Modelo: {model.name}")
        print(f"   Capas: {len(model.layers)}")
        print(f"   Parámetros: {model.count_params():,}")
        
        # Crear directorio de salida
        output_dir = 'pokemon-model'
        os.makedirs(output_dir, exist_ok=True)
        
        # Intentar usar tensorflowjs si está disponible
        try:
            import tensorflowjs as tfjs
            print(f"✅ TensorFlowJS {tfjs.__version__} disponible")
            print("🔄 Convirtiendo con TensorFlowJS...")
            tfjs.converters.save_keras_model(model, output_dir)
            print("✅ Conversión completada con TensorFlowJS")
            return True
        except ImportError:
            print("⚠️  TensorFlowJS no disponible, usando conversión manual...")
        
        # Conversión manual
        print("🔄 Realizando conversión manual...")
        
        # Guardar arquitectura del modelo
        model_json = model.to_json()
        model_config = json.loads(model_json)
        
        # Crear modelo TFJS compatible
        tfjs_model = {
            "modelTopology": {
                "model_config": model_config
            },
            "weightsManifest": []
        }
        
        # Guardar pesos
        weights = model.get_weights()
        weight_files = []
        
        for i, weight in enumerate(weights):
            weight_file = f"group{i}-shard1of1.bin"
            weight_path = os.path.join(output_dir, weight_file)
            
            # Guardar como float32
            weight.astype(np.float32).tofile(weight_path)
            
            weight_files.append({
                "paths": [weight_file],
                "weights": [{
                    "name": f"weight_{i}",
                    "shape": list(weight.shape),
                    "dtype": "float32"
                }]
            })
        
        tfjs_model["weightsManifest"] = weight_files
        
        # Guardar model.json
        with open(os.path.join(output_dir, 'model.json'), 'w') as f:
            json.dump(tfjs_model, f, indent=2)
        
        print(f"✅ Modelo guardado en: {output_dir}/")
        print(f"   - model.json")
        print(f"   - {len(weights)} archivos de pesos")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("  🧠 CONVERSIÓN MODELO KERAS → TENSORFLOW.JS")
    print("=" * 60)
    print()
    
    if convert_model():
        print("\n✅ ¡Conversión exitosa!")
        sys.exit(0)
    else:
        print("\n❌ Conversión fallida")
        sys.exit(1)
