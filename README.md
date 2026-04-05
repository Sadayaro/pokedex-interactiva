# Pokédex Interactiva

Pokédex con reconocimiento visual de Pokémon usando IA.

## Características

- 📸 Cámara en tiempo real para escanear Pokémon
- 🤖 Reconocimiento visual con MobileNet + modelo CNN
- 🔊 Síntesis de voz para anunciar Pokémon encontrados
- 📊 Información detallada de cada Pokémon
- 🎨 Diseño clásico de Pokédex

## Stack Tecnológico

- **Frontend**: React + Vite
- **ML**: TensorFlow.js + MobileNet
- **Deploy**: Vercel

## Desarrollo

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
vercel --prod
```

## Entrenamiento del Modelo

Ver carpeta `training/` para scripts de entrenamiento del modelo CNN.
