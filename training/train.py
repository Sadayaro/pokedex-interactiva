#!/usr/bin/env python3
"""
Entrenamiento de modelo CNN para clasificación de 151 Pokémon
Usa TensorFlow/Keras con transfer learning desde MobileNetV2
"""

import os
import sys
import json
import numpy as np
from PIL import Image
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from sklearn.model_selection import train_test_split
from pathlib import Path

# Configuración
DATASET_DIR = './dataset'
MODEL_DIR = './model'
TFJS_MODEL_DIR = '../pokemon-model'
IMAGE_SIZE = 224
NUM_CLASSES = 151
BATCH_SIZE = 32
EPOCHS = 30
VALIDATION_SPLIT = 0.2

def load_image(image_path):
    """Cargar y preprocesar una imagen"""
    try:
        img = Image.open(image_path).convert('RGB')
        img = img.resize((IMAGE_SIZE, IMAGE_SIZE))
        img_array = np.array(img) / 255.0  # Normalizar
        return img_array
    except Exception as e:
        print(f"Error cargando {image_path}: {e}")
        return None

def load_dataset():
    """Cargar todas las imágenes del dataset"""
    print("📂 Cargando dataset...")
    
    images = []
    labels = []
    
    for pokemon_id in range(1, NUM_CLASSES + 1):
        pokemon_dir = Path(DATASET_DIR) / str(pokemon_id)
        
        if not pokemon_dir.exists():
            continue
        
        image_files = list(pokemon_dir.glob('*.png')) + list(pokemon_dir.glob('*.jpg'))
        
        for img_path in image_files:
            img_array = load_image(str(img_path))
            if img_array is not None:
                images.append(img_array)
                labels.append(pokemon_id - 1)  # Labels 0-150
        
        if pokemon_id % 25 == 0:
            print(f"  Progreso: {pokemon_id}/151 Pokémon cargados")
    
    print(f"✅ Dataset cargado: {len(images)} imágenes")
    return np.array(images), np.array(labels)

def create_model():
    """Crear modelo CNN con transfer learning"""
    print("🧠 Creando modelo CNN...")
    
    # Base MobileNetV2 pre-entrenada
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(IMAGE_SIZE, IMAGE_SIZE, 3)
    )
    
    # Congelar capas base
    base_model.trainable = False
    
    # Construir modelo
    model = keras.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dropout(0.5),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.3),
        layers.Dense(NUM_CLASSES, activation='softmax')
    ])
    
    model.compile(
        optimizer=keras.optimizers.Adam(learning_rate=0.001),
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print(f"✅ Modelo creado: {model.count_params():,} parámetros")
    return model

def train_model():
    """Entrenar el modelo"""
    # Cargar datos
    X, y = load_dataset()
    
    if len(X) == 0:
        print("❌ No se encontraron imágenes para entrenar")
        return
    
    # Split train/validation
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=VALIDATION_SPLIT, random_state=42, stratify=y
    )
    
    print(f"📊 Training: {len(X_train)} imágenes, Validation: {len(X_val)} imágenes")
    
    # Crear modelo
    model = create_model()
    
    # Callbacks
    callbacks = [
        keras.callbacks.EarlyStopping(
            monitor='val_accuracy',
            patience=5,
            restore_best_weights=True
        ),
        keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=3,
            min_lr=1e-6
        ),
        keras.callbacks.ModelCheckpoint(
            os.path.join(MODEL_DIR, 'best_model.h5'),
            monitor='val_accuracy',
            save_best_only=True
        )
    ]
    
    # Entrenar
    print("\n🚀 Iniciando entrenamiento...")
    print(f"   Épocas: {EPOCHS}, Batch size: {BATCH_SIZE}")
    print("   Presiona Ctrl+C para cancelar\n")
    
    try:
        history = model.fit(
            X_train, y_train,
            batch_size=BATCH_SIZE,
            epochs=EPOCHS,
            validation_data=(X_val, y_val),
            callbacks=callbacks,
            verbose=1
        )
        
        # Evaluar
        val_loss, val_acc = model.evaluate(X_val, y_val, verbose=0)
        print(f"\n✅ Entrenamiento completado!")
        print(f"   Precisión validación: {val_acc:.2%}")
        
        # Guardar modelo
        os.makedirs(MODEL_DIR, exist_ok=True)
        model.save(os.path.join(MODEL_DIR, 'pokemon_cnn_model.h5'))
        print(f"   Modelo guardado en: {MODEL_DIR}")
        
        return model
        
    except KeyboardInterrupt:
        print("\n⚠️ Entrenamiento interrumpido por usuario")
        return None

def convert_to_tfjs(model):
    """Convertir modelo a formato TensorFlow.js"""
    print("\n🔄 Convirtiendo a TensorFlow.js...")
    
    try:
        import tensorflowjs as tfjs
        
        os.makedirs(TFJS_MODEL_DIR, exist_ok=True)
        
        tfjs.converters.save_keras_model(
            model,
            TFJS_MODEL_DIR
        )
        
        print(f"✅ Modelo convertido y guardado en: {TFJS_MODEL_DIR}")
        
        # Crear metadata
        metadata = {
            'version': '1.0',
            'num_classes': NUM_CLASSES,
            'image_size': IMAGE_SIZE,
            'model_type': 'cnn_mobilenet',
            'description': 'Modelo CNN para reconocimiento de 151 Pokémon'
        }
        
        with open(os.path.join(TFJS_MODEL_DIR, 'metadata.json'), 'w') as f:
            json.dump(metadata, f, indent=2)
        
        print("   Metadata guardada")
        
    except ImportError:
        print("⚠️ tensorflowjs no instalado. Para convertir:")
        print("   pip install tensorflowjs")
        print("   python train.py --convert")

if __name__ == '__main__':
    print("=" * 50)
    print("  🎮 ENTRENAMIENTO CNN - POKÉMON RECOGNITION")
    print("=" * 50)
    print()
    
    # Verificar dataset
    if not os.path.exists(DATASET_DIR):
        print(f"❌ Dataset no encontrado en: {DATASET_DIR}")
        print("   Ejecuta primero: node download-images.js")
        sys.exit(1)
    
    # Entrenar
    model = train_model()
    
    if model:
        # Convertir a TFJS
        convert_to_tfjs(model)
        
        print("\n" + "=" * 50)
        print("  ✅ ENTRENAMIENTO COMPLETADO")
        print("=" * 50)
        print("\n📁 Archivos generados:")
        print(f"   - training/model/pokemon_cnn_model.h5")
        print(f"   - pokemon-model/model.json (para la web)")
        print(f"   - pokemon-model/metadata.json")
        print("\n🌐 Para usar en la Pokédex:")
        print("   1. Abre la app en el navegador")
        print("   2. Haz clic en '🔧 Estado del Modelo'")
        print("   3. Verás 'Modelo CNN: ✅ Entrenado'")
