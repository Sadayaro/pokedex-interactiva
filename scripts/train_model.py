#!/usr/bin/env python3
"""
Script de entrenamiento para el modelo CNN de Pokémon
Requiere: pip install tensorflow numpy pillow
"""

import tensorflow as tf
import numpy as np
import json
import os

# Configuración
IMG_SIZE = 128
NUM_CLASSES = 15
BATCH_SIZE = 32
EPOCHS = 10

MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'pokemon-model')
os.makedirs(MODEL_DIR, exist_ok=True)

# Lista de Pokémon
POKEMON_LIST = [
    {"id": 1, "name": "Bulbasaur"},
    {"id": 2, "name": "Ivysaur"},
    {"id": 3, "name": "Venusaur"},
    {"id": 4, "name": "Charmander"},
    {"id": 5, "name": "Charmeleon"},
    {"id": 6, "name": "Charizard"},
    {"id": 7, "name": "Squirtle"},
    {"id": 8, "name": "Wartortle"},
    {"id": 9, "name": "Blastoise"},
    {"id": 25, "name": "Pikachu"},
    {"id": 26, "name": "Raichu"},
    {"id": 133, "name": "Eevee"},
    {"id": 143, "name": "Snorlax"},
    {"id": 150, "name": "Mewtwo"},
    {"id": 151, "name": "Mew"}
]

def create_light_model():
    """Crea un modelo CNN ligero para clasificación de Pokémon"""
    model = tf.keras.Sequential([
        # Capa de entrada
        tf.keras.layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3)),

        # Bloque convolucional 1
        tf.keras.layers.Conv2D(8, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),

        # Bloque convolucional 2
        tf.keras.layers.Conv2D(16, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),

        # Bloque convolucional 3
        tf.keras.layers.Conv2D(32, (3, 3), activation='relu'),
        tf.keras.layers.MaxPooling2D((2, 2)),

        # Aplanar
        tf.keras.layers.Flatten(),

        # Capa densa
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dropout(0.3),

        # Capa de salida
        tf.keras.layers.Dense(NUM_CLASSES, activation='softmax')
    ])

    return model

def generate_mock_data(samples_per_class=30):
    """Genera datos sintéticos de entrenamiento"""
    print(f"Generando {samples_per_class} muestras por clase...")

    X = []
    y = []

    for class_idx in range(NUM_CLASSES):
        for i in range(samples_per_class):
            # Crear imagen sintética con color característico de cada clase
            base_color = np.random.normal(class_idx * 0.1, 0.2, (IMG_SIZE, IMG_SIZE, 3))
            noise = np.random.normal(0, 0.1, (IMG_SIZE, IMG_SIZE, 3))
            image = np.clip(base_color + noise, 0, 1)

            X.append(image)
            y.append(class_idx)

    X = np.array(X, dtype=np.float32)
    y = tf.keras.utils.to_categorical(y, NUM_CLASSES)

    return X, y

def train_model():
    """Entrena el modelo y lo guarda"""
    print("=" * 50)
    print("🚀 ENTRENAMIENTO MODELO POKÉDEX CNN")
    print("=" * 50)

    # Crear modelo
    print("\n📐 Creando modelo...")
    model = create_light_model()

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    model.summary()

    # Generar datos
    print(f"\n📊 Generando datos de entrenamiento...")
    X_train, y_train = generate_mock_data(30)
    print(f"   Total de muestras: {len(X_train)}")

    # Entrenar
    print(f"\n🏋️  Entrenando por {EPOCHS} épocas...")
    history = model.fit(
        X_train, y_train,
        epochs=EPOCHS,
        batch_size=BATCH_SIZE,
        validation_split=0.2,
        verbose=1
    )

    # Mostrar resultados
    final_acc = history.history['accuracy'][-1]
    final_val_acc = history.history['val_accuracy'][-1]
    print(f"\n📈 Resultados:")
    print(f"   Precisión entrenamiento: {final_acc:.1%}")
    print(f"   Precisión validación: {final_val_acc:.1%}")

    # Guardar en formato TensorFlow.js
    print(f"\n💾 Guardando modelo...")

    # Guardar con tfjs converter format
    model.save(os.path.join(MODEL_DIR, 'model.keras'))

    # Convertir a formato TF.js
    print("   Convirtiendo a formato TensorFlow.js...")

    # Usar tensorflowjs_converter
    try:
        import tensorflowjs as tfjs
        tfjs.converters.save_keras_model(model, MODEL_DIR)
        print("   ✅ Conversión exitosa")
    except ImportError:
        print("   ⚠️  tensorflowjs no instalado, guardando solo formato Keras")
        print("   Para convertir: pip install tensorflowjs")
        print(f"   Luego: tensorflowjs_converter --input_format=keras {MODEL_DIR}/model.keras {MODEL_DIR}")

    # Crear metadata
    metadata = {
        "version": "1.0.0",
        "modelName": "Pokedex CNN",
        "numClasses": NUM_CLASSES,
        "imageSize": IMG_SIZE,
        "classes": POKEMON_LIST,
        "accuracy": {
            "train": float(final_acc),
            "validation": float(final_val_acc)
        },
        "createdAt": tf.timestamp().numpy().tolist()
    }

    with open(os.path.join(MODEL_DIR, 'metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)

    print(f"\n✅ Modelo guardado en: {MODEL_DIR}")

    # Listar archivos
    for file in os.listdir(MODEL_DIR):
        size = os.path.getsize(os.path.join(MODEL_DIR, file))
        print(f"   📄 {file} ({size/1024:.1f} KB)")

    print("\n" + "=" * 50)
    print("✅ ENTRENAMIENTO COMPLETADO")
    print("=" * 50)

if __name__ == '__main__':
    train_model()
