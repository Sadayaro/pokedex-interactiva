/**
 * Script para descargar imágenes de Pokémon para entrenamiento
 * Usa la PokeAPI y scraping de sprites
 */

const fs = require('fs-extra');
const path = require('path');
const fetch = require('node-fetch');

const DATASET_DIR = './dataset';
const IMAGES_PER_POKEMON = 50; // Imágenes por Pokémon
const TOTAL_POKEMON = 151; // Gen 1

// URLs de sprites de diferentes fuentes
const SPRITE_SOURCES = [
  (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
  (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${id}.png`,
  (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`,
  (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
  (id) => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${id}.png`,
  (id) => `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${String(id).padStart(3, '0')}.png`,
];

async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url, { timeout: 10000 });
    if (!response.ok) return false;
    
    const buffer = await response.buffer();
    await fs.writeFile(filepath, buffer);
    return true;
  } catch (error) {
    return false;
  }
}

async function downloadPokemonImages(pokemonId) {
  const pokemonDir = path.join(DATASET_DIR, String(pokemonId));
  await fs.ensureDir(pokemonDir);
  
  let downloadedCount = 0;
  
  for (let i = 0; i < SPRITE_SOURCES.length && downloadedCount < 10; i++) {
    const url = SPRITE_SOURCES[i](pokemonId);
    const filepath = path.join(pokemonDir, `sprite_${i}.png`);
    
    if (await downloadImage(url, filepath)) {
      downloadedCount++;
      console.log(`  ✓ Descargado: ${url}`);
    }
  }
  
  return downloadedCount;
}

async function generateAugmentedImages(pokemonId) {
  // Aquí iría el código para generar versiones aumentadas de las imágenes
  // (rotaciones, zoom, cambios de brillo, etc.)
  // Por ahora solo duplicamos las existentes
  const pokemonDir = path.join(DATASET_DIR, String(pokemonId));
  const files = await fs.readdir(pokemonDir);
  
  let count = files.length;
  
  for (const file of files) {
    if (count >= IMAGES_PER_POKEMON) break;
    
    const srcPath = path.join(pokemonDir, file);
    const destPath = path.join(pokemonDir, `aug_${count}.png`);
    
    // Copiar como versión aumentada (simplificado)
    await fs.copy(srcPath, destPath);
    count++;
  }
  
  return count;
}

async function createDataset() {
  console.log('🎮 Creando dataset de entrenamiento...\n');
  
  await fs.ensureDir(DATASET_DIR);
  
  let totalImages = 0;
  
  for (let id = 1; id <= TOTAL_POKEMON; id++) {
    process.stdout.write(`Descargando Pokémon #${id}... `);
    
    const downloaded = await downloadPokemonImages(id);
    const total = await generateAugmentedImages(id);
    
    console.log(`${total} imágenes`);
    totalImages += total;
    
    // Delay para no sobrecargar las APIs
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log(`\n✅ Dataset creado: ${totalImages} imágenes totales`);
  console.log(`📁 Ubicación: ${DATASET_DIR}/`);
}

// Ejecutar
if (require.main === module) {
  createDataset().catch(console.error);
}

module.exports = { createDataset };
