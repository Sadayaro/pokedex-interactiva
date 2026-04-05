const fs = require('fs')
const https = require('https')
const path = require('path')

// Lista de los 151 Pokemon originales
const POKEMON_LIST = [
  { id: 1, name: 'Bulbasaur' },
  { id: 2, name: 'Ivysaur' },
  { id: 3, name: 'Venusaur' },
  { id: 4, name: 'Charmander' },
  { id: 5, name: 'Charmeleon' },
  { id: 6, name: 'Charizard' },
  { id: 7, name: 'Squirtle' },
  { id: 8, name: 'Wartortle' },
  { id: 9, name: 'Blastoise' },
  { id: 10, name: 'Caterpie' },
  { id: 11, name: 'Metapod' },
  { id: 12, name: 'Butterfree' },
  { id: 13, name: 'Weedle' },
  { id: 14, name: 'Kakuna' },
  { id: 15, name: 'Beedrill' },
  { id: 16, name: 'Pidgey' },
  { id: 17, name: 'Pidgeotto' },
  { id: 18, name: 'Pidgeot' },
  { id: 19, name: 'Rattata' },
  { id: 20, name: 'Raticate' },
  { id: 21, name: 'Spearow' },
  { id: 22, name: 'Fearow' },
  { id: 23, name: 'Ekans' },
  { id: 24, name: 'Arbok' },
  { id: 25, name: 'Pikachu' },
  { id: 26, name: 'Raichu' },
  { id: 27, name: 'Sandshrew' },
  { id: 28, name: 'Sandslash' },
  { id: 29, name: 'Nidoran-female' },
  { id: 30, name: 'Nidorina' },
  { id: 31, name: 'Nidoqueen' },
  { id: 32, name: 'Nidoran-male' },
  { id: 33, name: 'Nidorino' },
  { id: 34, name: 'Nidoking' },
  { id: 35, name: 'Clefairy' },
  { id: 36, name: 'Clefable' },
  { id: 37, name: 'Vulpix' },
  { id: 38, name: 'Ninetales' },
  { id: 39, name: 'Jigglypuff' },
  { id: 40, name: 'Wigglytuff' },
  { id: 41, name: 'Zubat' },
  { id: 42, name: 'Golbat' },
  { id: 43, name: 'Oddish' },
  { id: 44, name: 'Gloom' },
  { id: 45, name: 'Vileplume' },
  { id: 46, name: 'Paras' },
  { id: 47, name: 'Parasect' },
  { id: 48, name: 'Venonat' },
  { id: 49, name: 'Venomoth' },
  { id: 50, name: 'Diglett' },
  { id: 51, name: 'Dugtrio' },
  { id: 52, name: 'Meowth' },
  { id: 53, name: 'Persian' },
  { id: 54, name: 'Psyduck' },
  { id: 55, name: 'Golduck' },
  { id: 56, name: 'Mankey' },
  { id: 57, name: 'Primeape' },
  { id: 58, name: 'Growlithe' },
  { id: 59, name: 'Arcanine' },
  { id: 60, name: 'Poliwag' },
  { id: 61, name: 'Poliwhirl' },
  { id: 62, name: 'Poliwrath' },
  { id: 63, name: 'Abra' },
  { id: 64, name: 'Kadabra' },
  { id: 65, name: 'Alakazam' },
  { id: 66, name: 'Machop' },
  { id: 67, name: 'Machoke' },
  { id: 68, name: 'Machamp' },
  { id: 69, name: 'Bellsprout' },
  { id: 70, name: 'Weepinbell' },
  { id: 71, name: 'Victreebel' },
  { id: 72, name: 'Tentacool' },
  { id: 73, name: 'Tentacruel' },
  { id: 74, name: 'Geodude' },
  { id: 75, name: 'Graveler' },
  { id: 76, name: 'Golem' },
  { id: 77, name: 'Ponyta' },
  { id: 78, name: 'Rapidash' },
  { id: 79, name: 'Slowpoke' },
  { id: 80, name: 'Slowbro' },
  { id: 81, name: 'Magnemite' },
  { id: 82, name: 'Magneton' },
  { id: 83, name: 'Farfetchd' },
  { id: 84, name: 'Doduo' },
  { id: 85, name: 'Dodrio' },
  { id: 86, name: 'Seel' },
  { id: 87, name: 'Dewgong' },
  { id: 88, name: 'Grimer' },
  { id: 89, name: 'Muk' },
  { id: 90, name: 'Shellder' },
  { id: 91, name: 'Cloyster' },
  { id: 92, name: 'Gastly' },
  { id: 93, name: 'Haunter' },
  { id: 94, name: 'Gengar' },
  { id: 95, name: 'Onix' },
  { id: 96, name: 'Drowzee' },
  { id: 97, name: 'Hypno' },
  { id: 98, name: 'Krabby' },
  { id: 99, name: 'Kingler' },
  { id: 100, name: 'Voltorb' },
  { id: 101, name: 'Electrode' },
  { id: 102, name: 'Exeggcute' },
  { id: 103, name: 'Exeggutor' },
  { id: 104, name: 'Cubone' },
  { id: 105, name: 'Marowak' },
  { id: 106, name: 'Hitmonlee' },
  { id: 107, name: 'Hitmonchan' },
  { id: 108, name: 'Lickitung' },
  { id: 109, name: 'Koffing' },
  { id: 110, name: 'Weezing' },
  { id: 111, name: 'Rhyhorn' },
  { id: 112, name: 'Rhydon' },
  { id: 113, name: 'Chansey' },
  { id: 114, name: 'Tangela' },
  { id: 115, name: 'Kangaskhan' },
  { id: 116, name: 'Horsea' },
  { id: 117, name: 'Seadra' },
  { id: 118, name: 'Goldeen' },
  { id: 119, name: 'Seaking' },
  { id: 120, name: 'Staryu' },
  { id: 121, name: 'Starmie' },
  { id: 122, name: 'Mr. Mime' },
  { id: 123, name: 'Scyther' },
  { id: 124, name: 'Jynx' },
  { id: 125, name: 'Electabuzz' },
  { id: 126, name: 'Magmar' },
  { id: 127, name: 'Pinsir' },
  { id: 128, name: 'Tauros' },
  { id: 129, name: 'Magikarp' },
  { id: 130, name: 'Gyarados' },
  { id: 131, name: 'Lapras' },
  { id: 132, name: 'Ditto' },
  { id: 133, name: 'Eevee' },
  { id: 134, name: 'Vaporeon' },
  { id: 135, name: 'Jolteon' },
  { id: 136, name: 'Flareon' },
  { id: 137, name: 'Porygon' },
  { id: 138, name: 'Omanyte' },
  { id: 139, name: 'Omastar' },
  { id: 140, name: 'Kabuto' },
  { id: 141, name: 'Kabutops' },
  { id: 142, name: 'Aerodactyl' },
  { id: 143, name: 'Snorlax' },
  { id: 144, name: 'Articuno' },
  { id: 145, name: 'Zapdos' },
  { id: 146, name: 'Moltres' },
  { id: 147, name: 'Dratini' },
  { id: 148, name: 'Dragonair' },
  { id: 149, name: 'Dragonite' },
  { id: 150, name: 'Mewtwo' },
  { id: 151, name: 'Mew' }
]

// Crear directorio para dataset
const DATASET_DIR = path.join(__dirname, '..', 'dataset')
if (!fs.existsSync(DATASET_DIR)) {
  fs.mkdirSync(DATASET_DIR, { recursive: true })
}

// Función para descargar una imagen
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Seguir redirección
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file)
          file.on('finish', () => {
            file.close()
            resolve()
          })
        }).on('error', reject)
      } else {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve()
        })
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
  })
}

// Función para descargar imágenes de un Pokémon usando PokeAPI
async function downloadPokemonImages(pokemon, count = 50) {
  const pokemonDir = path.join(DATASET_DIR, String(pokemon.id).padStart(3, '0'))
  if (!fs.existsSync(pokemonDir)) {
    fs.mkdirSync(pokemonDir, { recursive: true })
  }

  console.log(`\n📥 Descargando imágenes de ${pokemon.name} (ID: ${pokemon.id})...`)
  
  try {
    // Descargar sprite oficial
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`
    const spritePath = path.join(pokemonDir, 'official.png')
    
    try {
      await downloadImage(spriteUrl, spritePath)
      console.log(`  ✅ Sprite oficial descargado`)
    } catch (err) {
      console.log(`  ⚠️ No se pudo descargar sprite oficial`)
    }

    // Intentar descargar más sprites de diferentes ángulos
    const additionalSprites = [
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${pokemon.id}.png`,
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${pokemon.id}.png`
    ]

    for (let i = 0; i < additionalSprites.length; i++) {
      try {
        const filepath = path.join(pokemonDir, `sprite_${i}.png`)
        await downloadImage(additionalSprites[i], filepath)
        console.log(`  ✅ Sprite adicional ${i + 1} descargado`)
      } catch (err) {
        // Ignorar errores de sprites adicionales
      }
    }

    console.log(`  📊 Total: ${fs.readdirSync(pokemonDir).length} imágenes`)
    
  } catch (error) {
    console.error(`  ❌ Error descargando ${pokemon.name}:`, error.message)
  }
}

// Función principal
async function main() {
  console.log('='.repeat(60))
  console.log('🎮 Descargador de Imágenes Pokémon (151 clases)')
  console.log('='.repeat(60))
  console.log(`\n📁 Dataset se guardará en: ${DATASET_DIR}`)
  console.log(`🎯 Total de Pokémon a descargar: ${POKEMON_LIST.length}`)
  console.log('⚠️ Esto descargará sprites de PokeAPI (gratis, sin API key)')
  console.log('⚠️ NOTA: Para entrenamiento real necesitarás más imágenes (50-100 por clase)')
  console.log('   Esta descarga inicial solo obtiene los sprites oficiales.\n')
  
  let downloaded = 0
  for (const pokemon of POKEMON_LIST) {
    await downloadPokemonImages(pokemon, 4)
    downloaded++
    
    // Mostrar progreso cada 10 Pokémon
    if (downloaded % 10 === 0) {
      console.log(`\n📈 Progreso: ${downloaded}/${POKEMON_LIST.length} Pokémon (${Math.round(downloaded/POKEMON_LIST.length*100)}%)`)
    }
    
    // Pequeña pausa para no saturar la API
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ Descarga completada')
  console.log('='.repeat(60))
  console.log(`\n📊 Resumen:`)
  console.log(`   - Pokémon descargados: ${downloaded}`)
  console.log(`   - Ubicación: ${DATASET_DIR}`)
  console.log(`\n⚠️ IMPORTANTE:`)
  console.log(`   Para entrenar un modelo de calidad, necesitas:`)
  console.log(`   - Al menos 50-100 imágenes POR Pokémon`)
  console.log(`   - Imágenes de diferentes ángulos, poses, fondos`)
  console.log(`   - Considera usar datasets como Pokemon Image Dataset de Kaggle`)
  console.log(`\n📝 Próximos pasos:`)
  console.log(`   1. Revisa las imágenes descargadas`)
  console.log(`   2. Considera ampliar el dataset con más fuentes`)
  console.log(`   3. En la próxima sesión crearemos el script de entrenamiento`)
}

// Ejecutar
main().catch(console.error)
