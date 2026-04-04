// Sistema de reconocimiento visual avanzado para Pokedex
// Base de datos de formas y características visuales detalladas

const POKEMON_SHAPES_DATABASE = {
    // Formas base disponibles
    bodyStyles: {
        cuadrupedo_canino: {
            description: "Cuatro patas, hocico puntiagudo, cola",
            examples: ["Growlithe", "Arcanine", "Eevee"],
            keyFeatures: ["pointed_snout", "four_legs", "tail", "ears"],
            typicalColors: ["brown", "orange", "tan", "cream"]
        },
        cuadrupedo_felino: {
            description: "Cuatro patas, hocico redondo, bigotes",
            examples: ["Meowth", "Persian"],
            keyFeatures: ["round_snout", "four_legs", "tail", "whiskers", "ears"],
            typicalColors: ["tan", "cream", "yellow", "blue"]
        },
        cuadrupedo_roedor: {
            description: "Cuerpo pequeño, redondo, cola larga",
            examples: ["Rattata", "Raticate", "Pikachu", "Raichu", "Sandshrew", "Sandslash"],
            keyFeatures: ["round_body", "small", "long_tail", "ears"],
            typicalColors: ["yellow", "purple", "brown", "orange"]
        },
        bipedo_con_cola: {
            description: "Dos patas, cola larga, reptiliano",
            examples: ["Charmander", "Charmeleon"],
            keyFeatures: ["two_legs", "long_tail", "reptile", "claws"],
            typicalColors: ["orange", "red", "yellow"]
        },
        bipedo_con_alas: {
            description: "Dos patas, alas grandes, puede volar",
            examples: ["Charizard", "Dragonite"],
            keyFeatures: ["two_legs", "wings", "large", "tail"],
            typicalColors: ["orange", "blue", "green", "red"]
        },
        caparazon_redondo: {
            description: "Caparazón duro redondo, cuatro patas cortas",
            examples: ["Squirtle", "Wartortle", "Blastoise"],
            keyFeatures: ["shell", "round", "four_legs", "short_limbs"],
            typicalColors: ["blue", "brown", "gray"]
        },
        planta_con_capullo: {
            description: "Planta en la espalda, cuatro patas",
            examples: ["Bulbasaur", "Ivysaur", "Venusaur"],
            keyFeatures: ["plant_on_back", "bulb", "four_legs", "green"],
            typicalColors: ["green", "blue", "pink"]
        },
        serpiente: {
            description: "Cuerpo alargado sin patas",
            examples: ["Ekans", "Arbok", "Onix", "Dratini", "Dragonair"],
            keyFeatures: ["no_legs", "elongated", "slithers", "scales"],
            typicalColors: ["purple", "gray", "black", "yellow", "blue"]
        },
        alas_completas: {
            description: "Alas grandes, cuerpo ligero, puede volar",
            examples: ["Butterfree", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Zubat", "Golbat"],
            keyFeatures: ["wings", "flying", "light_body", "six_legs_or_wings"],
            typicalColors: ["purple", "yellow", "brown", "black", "blue"]
        },
        insecto_segmentado: {
            description: "Cuerpo segmentado, múltiples patas",
            examples: ["Caterpie", "Weedle", "Paras", "Venonat"],
            keyFeatures: ["segmented", "multiple_legs", "antennae"],
            typicalColors: ["green", "brown", "yellow", "red"]
        },
        capullo: {
            description: "Forma de capullo/crisálida, inmóvil",
            examples: ["Metapod", "Kakuna"],
            keyFeatures: ["immobile", "cocoon", "oval"],
            typicalColors: ["green", "yellow"]
        },
        cabeza_sola: {
            description: "Solo la cabeza visible, sin cuerpo aparente",
            examples: ["Diglett", "Dugtrio", "Voltorb", "Electrode"],
            keyFeatures: ["head_only", "round", "no_body", "buried"],
            typicalColors: ["brown", "red", "white"]
        },
        esfera: {
            description: "Forma esférica perfecta",
            examples: ["Jigglypuff", "Wigglytuff", "Koffing", "Weezing"],
            keyFeatures: ["spherical", "round", "inflatable"],
            typicalColors: ["pink", "purple", "white"]
        },
        bipedo_redondo: {
            description: "Dos patas, cuerpo redondo/grueso",
            examples: ["Clefairy", "Clefable", "Chansey", "Snorlax", "Cubone"],
            keyFeatures: ["two_legs", "round_body", "plump", "short_limbs"],
            typicalColors: ["pink", "white", "teal", "green"]
        },
        bipedo_colas: {
            description: "Dos patas, múltiples colas",
            examples: ["Vulpix", "Ninetales", "Hypno", "Mewtwo"],
            keyFeatures: ["two_legs", "multiple_tails", "furry"],
            typicalColors: ["orange", "yellow", "purple", "white"]
        },
        bipedo_mono: {
            description: "Dos patas, brazos largos, simio",
            examples: ["Mankey", "Primeape"],
            keyFeatures: ["two_legs", "long_arms", "monkey", "tail"],
            typicalColors: ["tan", "brown"]
        },
        bipedo_musculoso: {
            description: "Dos patas, cuerpo musculoso/atlético",
            examples: ["Machop", "Machoke", "Machamp", "Hitmonlee", "Hitmonchan"],
            keyFeatures: ["two_legs", "muscular", "humanoid", "strong"],
            typicalColors: ["gray", "blue", "red", "brown"]
        },
        tentaculos: {
            description: "Cuerpo con múltiples tentáculos",
            examples: ["Tentacool", "Tentacruel"],
            keyFeatures: ["tentacles", "jellyfish", "floating", "many_appendages"],
            typicalColors: ["blue", "red", "white"]
        },
        cabeza_con_brazos: {
            description: "Cabeza redonda con brazos, sin patas",
            examples: ["Geodude"],
            keyFeatures: ["floating", "round_head", "arms_only", "rocky"],
            typicalColors: ["gray", "brown"]
        },
        multiple_patas: {
            description: "Múltiples patas (6-8), arácnido/insectoide",
            examples: ["Paras", "Parasect", "Venonat", "Venomoth", "Scyther", "Pinsir"],
            keyFeatures: ["six_legs", "insect", "crawler", "claws"],
            typicalColors: ["red", "tan", "purple", "green", "brown"]
        },
        cuadrupedo_grande: {
            description: "Cuatro patas, cuerpo grande y pesado",
            examples: ["Rhyhorn", "Tauros", "Kangaskhan"],
            keyFeatures: ["four_legs", "large_body", "heavy", "horns"],
            typicalColors: ["gray", "brown", "tan"]
        },
        cuadrupedo_caballo: {
            description: "Cuatro patas, forma equina, rápido",
            examples: ["Ponyta", "Rapidash"],
            keyFeatures: ["four_legs", "horse_like", "mane", "fast"],
            typicalColors: ["yellow", "orange", "red", "white"]
        },
        aletas: {
            description: "Aletas en lugar de patas, acuático",
            examples: ["Goldeen", "Seaking", "Magikarp", "Gyarados", "Lapras", "Seel", "Dewgong"],
            keyFeatures: ["fins", "aquatic", "no_legs", "swimming"],
            typicalColors: ["white", "red", "orange", "blue", "pink"]
        },
        cuadrupedo_redondo: {
            description: "Cuatro patas, cuerpo redondo y gordo",
            examples: ["Slowpoke", "Slowbro"],
            keyFeatures: ["four_legs", "round_fat", "slow", "lazy"],
            typicalColors: ["pink", "cream"]
        },
        esfera_magnetica: {
            description: "Forma esférica metálica/magnética",
            examples: ["Magnemite", "Magneton"],
            keyFeatures: ["spherical", "metal", "magnetic", "floating"],
            typicalColors: ["gray", "silver", "red", "blue"]
        },
        ave_dos_cabezas: {
            description: "Ave con dos cabezas",
            examples: ["Doduo"],
            keyFeatures: ["two_heads", "bird", "two_necks", "wings"],
            typicalColors: ["brown", "tan", "black"]
        },
        ave_tres_cabezas: {
            description: "Ave con tres cabezas",
            examples: ["Dodrio"],
            keyFeatures: ["three_heads", "bird", "three_necks", "wings"],
            typicalColors: ["brown", "tan", "black"]
        },
        cabeza_con_patas: {
            description: "Cabeza grande con patas pequeñas",
            examples: ["Poliwag", "Horsea", "Seadra"],
            keyFeatures: ["large_head", "small_limbs", "tadpole_like"],
            typicalColors: ["blue", "yellow", "white"]
        },
        cabeza_con_patas_ondulantes: {
            description: "Cabeza con patas ondulantes/onduladas",
            examples: ["Bellsprout", "Weepinbell", "Victreebel"],
            keyFeatures: ["plant_like", "root_legs", "pitcher", "bell"],
            typicalColors: ["green", "yellow"]
        },
        bipedo_bigote: {
            description: "Dos patas, bigote largo, roedor",
            examples: ["Abra", "Kadabra", "Alakazam"],
            keyFeatures: ["two_legs", "mustache", "furry", "spoons"],
            typicalColors: ["yellow", "brown", "gray"]
        },
        concha: {
            description: "Forma de concha bivalva",
            examples: ["Shellder", "Cloyster"],
            keyFeatures: ["shell", "bivalve", "pearl", "spiked"],
            typicalColors: ["purple", "black", "white"]
        },
        gasoso: {
            description: "Forma gaseosa, etérea",
            examples: ["Gastly", "Haunter", "Gengar"],
            keyFeatures: ["gas", "ghostly", "floating", "translucent"],
            typicalColors: ["purple", "black", "red"]
        },
        bipedo_ave: {
            description: "Dos patas, forma de ave que camina",
            examples: ["Farfetch'd"],
            keyFeatures: ["two_legs", "duck", "leek", "wings"],
            typicalColors: ["brown", "white", "green"]
        },
        huevos: {
            description: "Múltiples huevos agrupados",
            examples: ["Exeggcute"],
            keyFeatures: ["eggs", "cluster", "six", "pink"],
            typicalColors: ["pink", "yellow"]
        },
        palmera: {
            description: "Forma de palmera con cabezas",
            examples: ["Exeggutor"],
            keyFeatures: ["palm_tree", "three_heads", "tall", "coconut"],
            typicalColors: ["yellow", "brown", "green"]
        },
        bipedo_con_bolsa: {
            description: "Dos patas, con bolsa marsupial",
            examples: ["Kangaskhan"],
            keyFeatures: ["two_legs", "pouch", "maternal", "joey"],
            typicalColors: ["brown", "tan", "cream"]
        },
        estrella: {
            description: "Forma estrellada, simetría radial",
            examples: ["Staryu", "Starmie"],
            keyFeatures: ["star", "five_points", "radial", "gem_center"],
            typicalColors: ["brown", "gold", "purple", "red"]
        },
        bipedo_mime: {
            description: "Dos patas, payaso/mimo",
            examples: ["Mr. Mime"],
            keyFeatures: ["two_legs", "clown", "white_face", "barriers"],
            typicalColors: ["pink", "red", "blue", "white"]
        },
        bipedo_largo: {
            description: "Dos patas, cuerpo largo y delgado",
            examples: ["Jynx"],
            keyFeatures: ["two_legs", "long_hair", "humanoid", "lips"],
            typicalColors: ["red", "white", "purple"]
        },
        bipedo_bolardo: {
            description: "Dos patas, brazos largos como guadañas",
            examples: ["Scyther"],
            keyFeatures: ["two_legs", "scythe_arms", "mantis", "green"],
            typicalColors: ["green", "white"]
        },
        cuadrupedo_cuernos: {
            description: "Cuatro patas, cuernos grandes",
            examples: ["Tauros"],
            keyFeatures: ["four_legs", "three_tails", "horns", "bull"],
            typicalColors: ["brown", "tan", "black"]
        },
        cuadrupedo_aletas: {
            description: "Cuatro patas con aletas, sirena",
            examples: ["Vaporeon"],
            keyFeatures: ["four_legs", "fin_tail", "mermaid", "blue"],
            typicalColors: ["blue", "white", "darkblue"]
        },
        cuadrupedo_puntiagudo: {
            description: "Cuatro patas, espinas/púas",
            examples: ["Jolteon", "Sandslash"],
            keyFeatures: ["four_legs", "spiky", "electric", "spines"],
            typicalColors: ["yellow", "white", "black"]
        },
        ave_digital: {
            description: "Ave de apariencia digital/artificial",
            examples: ["Porygon"],
            keyFeatures: ["polygonal", "digital", "bird", "geometric"],
            typicalColors: ["pink", "blue"]
        },
        caparazon_caracol: {
            description: "Caparazón en espiral, tentáculos",
            examples: ["Omanyte", "Omastar"],
            keyFeatures: ["spiral_shell", "tentacles", "ammonite", "ancient"],
            typicalColors: ["blue", "tan", "yellow"]
        },
        caparazon_cangrejo: {
            description: "Caparazón duro, escamas",
            examples: ["Kabuto"],
            keyFeatures: ["horseshoe_crab", "shell", "primitive", "brown"],
            typicalColors: ["brown", "tan", "black"]
        },
        bipedo_garras: {
            description: "Dos patas, garras/guadañas grandes",
            examples: ["Kabutops"],
            keyFeatures: ["two_legs", "scythe_claws", "predator", "ancient"],
            typicalColors: ["brown", "tan", "white"]
        },
        pterosaurio: {
            description: "Alas de piel, pico grande",
            examples: ["Aerodactyl"],
            keyFeatures: ["pterodactyl", "wings", "jaws", "rock"],
            typicalColors: ["purple", "green", "tan"]
        },
        ave_legendario: {
            description: "Ave majestuosa con plumaje especial",
            examples: ["Articuno", "Zapdos", "Moltres"],
            keyFeatures: ["legendary", "large_wings", "elemental", "glowing"],
            typicalColors: ["blue", "white", "yellow", "orange"]
        },
        gato_flotante: {
            description: "Gato flotante, cola larga",
            examples: ["Mew"],
            keyFeatures: ["floating", "cat", "small", "psychic", "pink"],
            typicalColors: ["pink", "white"]
        },
        bipedo_garras_pies: {
            description: "Dos patas, pies/garras muy grandes",
            examples: ["Golduck"],
            keyFeatures: ["two_legs", "large_feet", "duck", "crest", "blue"],
            typicalColors: ["blue", "red", "cream"]
        },
        bipedo_pluma_cabeza: {
            description: "Dos patas, pluma cresta en cabeza",
            examples: ["Psyduck"],
            keyFeatures: ["two_legs", "headache", "yellow", "crest"],
            typicalColors: ["yellow", "cream"]
        },
        serpiente_dragon: {
            description: "Serpiente dragón larga, sin patas o pequeñas",
            examples: ["Gyarados"],
            keyFeatures: ["serpent", "dragon", "no_legs", "fins", "rage"],
            typicalColors: ["blue", "red", "gold", "white"]
        },
        caparazon_grande: {
            description: "Caparazón muy grande, cuello largo",
            examples: ["Lapras"],
            keyFeatures: ["large_shell", "long_neck", "plesiosaur", "gentle"],
            typicalColors: ["blue", "gray", "cream"]
        },
        amorfo: {
            description: "Sin forma definida, blob",
            examples: ["Ditto"],
            keyFeatures: ["amorphous", "blob", "transform", "pink"],
            typicalColors: ["pink", "purple"]
        },
        bipedo_colmillos: {
            description: "Dos patas, colmillos/garras prominentes",
            examples: ["Nidoqueen", "Nidoking"],
            keyFeatures: ["two_legs", "fangs", "spikes", "drill"],
            typicalColors: ["blue", "purple", "tan"]
        },
        cuadrupedo_cuerno: {
            description: "Cuatro patas, cuerno en la cabeza",
            examples: ["Nidoran♂", "Nidorino"],
            keyFeatures: ["four_legs", "horn", "spikes", "aggressive"],
            typicalColors: ["purple", "white"]
        },
        bipedo_colmillos_cola: {
            description: "Dos patas, cola poderosa, colmillos",
            examples: ["Nidoking"],
            keyFeatures: ["two_legs", "powerful_tail", "fangs", "drill"],
            typicalColors: ["purple", "tan"]
        },
        bipedo_alas: {
            description: "Dos patas, alas de hada",
            examples: ["Clefable"],
            keyFeatures: ["two_legs", "fairy_wings", "cute", "pink"],
            typicalColors: ["pink", "white"]
        },
        multiple_cabezas: {
            description: "Tres cabezas unidas",
            examples: ["Dugtrio"],
            keyFeatures: ["three_heads", "united", "mole"],
            typicalColors: ["brown", "pink"]
        },
        planta_tallo: {
            description: "Planta con tallo largo y boca",
            examples: ["Bellsprout", "Weepinbell", "Victreebel"],
            keyFeatures: ["plant", "long_stem", "mouth", "roots"],
            typicalColors: ["green", "yellow"]
        },
        bipedo_piernas: {
            description: "Dos patas, piernas muy largas",
            examples: ["Hitmonlee"],
            keyFeatures: ["two_legs", "long_legs", "kicking", "fighting"],
            typicalColors: ["brown", "tan"]
        },
        bipedo_redondo_cola: {
            description: "Dos patas, cuerpo redondo, cola rayada",
            examples: ["Raichu"],
            keyFeatures: ["two_legs", "round_body", "striped_tail", "electric"],
            typicalColors: ["orange", "brown", "yellow"]
        },
        bipedo_con_caparazon: {
            description: "Dos patas, caparazón en la espalda o mano",
            examples: ["Slowbro"],
            keyFeatures: ["two_legs", "shell_on_hand", "dopey", "pink"],
            typicalColors: ["pink", "gray"]
        },
        bipedo_bigote_cucharas: {
            description: "Dos patas, bigote, dos cucharas",
            examples: ["Alakazam"],
            keyFeatures: ["two_legs", "mustache", "two_spoons", "psychic"],
            typicalColors: ["yellow", "brown", "gray"]
        },
        bipedo_multiples_brazos: {
            description: "Dos patas, cuatro brazos musculosos",
            examples: ["Machamp"],
            keyFeatures: ["two_legs", "four_arms", "belt", "fighting"],
            typicalColors: ["gray", "blue", "gold"]
        },
        roca_con_brazos: {
            description: "Roca flotante con brazos",
            examples: ["Geodude"],
            keyFeatures: ["floating", "rock", "arms", "no_legs"],
            typicalColors: ["gray", "brown"]
        },
        roca_multiple: {
            description: "Múltiples rocas unidas",
            examples: ["Graveler", "Golem"],
            keyFeatures: ["rock", "multiple", "boulders", "heavy"],
            typicalColors: ["gray", "brown", "green"]
        },
        bipedo_grande: {
            description: "Dos patas, muy grande y pesado",
            examples: ["Snorlax", "Rhydon"],
            keyFeatures: ["two_legs", "huge", "fat", "lazy_or_strong"],
            typicalColors: ["teal", "green", "gray"]
        },
        bipedo_garras: {
            description: "Dos patas, garras afiladas prominentes",
            examples: ["Kabutops"],
            keyFeatures: ["two_legs", "scythe_claws", "predator", "ancient"],
            typicalColors: ["brown", "tan"]
        }
    },

    // Características específicas por Pokémon para reconocimiento preciso
    pokemonSpecificFeatures: {
        Pikachu: {
            uniqueFeatures: ["red_cheeks", "pointed_ears", "lightning_tail", "yellow_body"],
            colorSignature: ["yellow", "red", "brown"],
            shapeSignature: "cuadrupedo_roedor",
            confidenceThreshold: 0.75
        },
        Charizard: {
            uniqueFeatures: ["orange_body", "blue_wings", "flame_tail", "horns"],
            colorSignature: ["orange", "blue", "red", "yellow"],
            shapeSignature: "bipedo_con_alas",
            confidenceThreshold: 0.70
        },
        Squirtle: {
            uniqueFeatures: ["blue_body", "brown_shell", "curly_tail", "small_size"],
            colorSignature: ["blue", "brown", "white"],
            shapeSignature: "caparazon_redondo",
            confidenceThreshold: 0.70
        },
        Bulbasaur: {
            uniqueFeatures: ["green_body", "bulb_on_back", "spots", "quadruped"],
            colorSignature: ["green", "teal", "blue"],
            shapeSignature: "planta_con_capullo",
            confidenceThreshold: 0.70
        },
        Charmander: {
            uniqueFeatures: ["orange_body", "flame_tail", "reptilian", "biped"],
            colorSignature: ["orange", "red", "yellow"],
            shapeSignature: "bipedo_con_cola",
            confidenceThreshold: 0.70
        },
        Meowth: {
            uniqueFeatures: ["cream_body", "coin_on_head", "feline", "whiskers"],
            colorSignature: ["cream", "tan", "gold"],
            shapeSignature: "cuadrupedo_felino",
            confidenceThreshold: 0.72
        },
        Psyduck: {
            uniqueFeatures: ["yellow_body", "headache", "crest", "confused"],
            colorSignature: ["yellow", "cream"],
            shapeSignature: "bipedo_pluma_cabeza",
            confidenceThreshold: 0.70
        },
        Gengar: {
            uniqueFeatures: ["purple_body", "red_eyes", "smile", "shadow"],
            colorSignature: ["purple", "red", "black"],
            shapeSignature: "gasoso",
            confidenceThreshold: 0.68
        },
        Dragonite: {
            uniqueFeatures: ["orange_body", "green_wings", "horns", "kind_face"],
            colorSignature: ["orange", "green", "white"],
            shapeSignature: "bipedo_con_alas",
            confidenceThreshold: 0.70
        },
        Eevee: {
            uniqueFeatures: ["brown_body", "fluffy_collar", "fox_like", "cute"],
            colorSignature: ["brown", "tan", "cream"],
            shapeSignature: "cuadrupedo_canino",
            confidenceThreshold: 0.72
        },
        Snorlax: {
            uniqueFeatures: ["huge_body", "green_body", "claws", "sleeping_face"],
            colorSignature: ["teal", "green", "cream"],
            shapeSignature: "bipedo_grande",
            confidenceThreshold: 0.75
        },
        Jigglypuff: {
            uniqueFeatures: ["pink_body", "round_ball", "big_eyes", "curl"],
            colorSignature: ["pink", "blue_eyes"],
            shapeSignature: "esfera",
            confidenceThreshold: 0.72
        },
        Onix: {
            uniqueFeatures: ["rock_segments", "long_snake", "gray", "large"],
            colorSignature: ["gray", "black"],
            shapeSignature: "serpiente",
            confidenceThreshold: 0.75
        },
        Lapras: {
            uniqueFeatures: ["blue_body", "gray_shell", "long_neck", "gentle"],
            colorSignature: ["blue", "gray", "cream"],
            shapeSignature: "caparazon_grande",
            confidenceThreshold: 0.72
        },
        Gyarados: {
            uniqueFeatures: ["blue_serpent", "red_fins", "rage", "fangs"],
            colorSignature: ["blue", "red", "gold", "white"],
            shapeSignature: "serpiente_dragon",
            confidenceThreshold: 0.75
        }
    },

    // Función para calcular similitud entre características
    calculateFeatureMatch(detectedFeatures, pokemonFeatures) {
        let matches = 0;
        let totalWeight = 0;
        
        for (const [feature, weight] of Object.entries(detectedFeatures)) {
            totalWeight += weight;
            if (pokemonFeatures.includes(feature)) {
                matches += weight;
            }
        }
        
        return totalWeight > 0 ? matches / totalWeight : 0;
    },

    // Función para calcular similitud de histograma de color
    calculateColorSimilarity(detectedColors, signatureColors) {
        let matches = 0;
        for (const color of detectedColors) {
            if (signatureColors.includes(color)) {
                matches++;
            }
        }
        return detectedColors.length > 0 ? matches / detectedColors.length : 0;
    }
};

// Exportar para uso en app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { POKEMON_SHAPES_DATABASE };
}
