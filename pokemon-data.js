// Base de datos completa - Primeros 151 Pokémon (Generación 1)
// Con características visuales y FORMAS (body styles) para reconocimiento
const POKEMON_DATABASE = [
    // Bulbasaur line
    { id: 1, name: "Bulbasaur", types: ["grass", "poison"], height: "0.7 m", weight: "6.9 kg", ability: "Espesura", 
      description: "Hay un bulboplanta en su espalda. Cuando absorbe los rayos solares, el bulboplanta va haciéndose cada vez más grande.",
      visualTraits: { colors: ["green", "blue", "teal"], shape: "quadruped", category: "plant", bodyStyle: "cuadrupedo_con_capullo" } },
    { id: 2, name: "Ivysaur", types: ["grass", "poison"], height: "1.0 m", weight: "13.0 kg", ability: "Espesura",
      description: "Este Pokémon lleva un bulbo en el lomo. Para poder aguantar el peso, tiene unas patas y un tronco gruesos y fuertes.",
      visualTraits: { colors: ["green", "blue", "pink"], shape: "quadruped", category: "plant", bodyStyle: "cuadrupedo_con_capullo" } },
    { id: 3, name: "Venusaur", types: ["grass", "poison"], height: "2.0 m", weight: "100.0 kg", ability: "Espesura",
      description: "Según parece, la flor de Venusaur libera una suave fragancia que tiene un efecto relajante en el ánimo de las personas.",
      visualTraits: { colors: ["green", "blue", "pink"], shape: "quadruped_large", category: "plant", bodyStyle: "cuadrupedo_con_flor" } },
    
    // Charmander line
    { id: 4, name: "Charmander", types: ["fire"], height: "0.6 m", weight: "8.5 kg", ability: "Mar llamas",
      description: "La llama de la punta de la cola de Charmander es la medida de su vida. Si se le apaga, fallece.",
      visualTraits: { colors: ["orange", "red", "yellow"], shape: "biped_small", category: "lizard", bodyStyle: "bipedo_con_cola" } },
    { id: 5, name: "Charmeleon", types: ["fire"], height: "1.1 m", weight: "19.0 kg", ability: "Mar llamas",
      description: "Charmeleon destroza a sus enemigos sin piedad con sus afiladas garras. La llama de su cola arde intensamente.",
      visualTraits: { colors: ["red", "orange", "yellow"], shape: "biped_medium", category: "lizard", bodyStyle: "bipedo_con_cola" } },
    { id: 6, name: "Charizard", types: ["fire", "flying"], height: "1.7 m", weight: "90.5 kg", ability: "Mar llamas",
      description: "Charizard se dedica a volar por los cielos en busca de oponentes fuertes. Echa fuego por la boca.",
      visualTraits: { colors: ["orange", "red", "yellow", "blue"], shape: "winged_dragon", category: "dragon", bodyStyle: "bipedo_con_alas" } },
    
    // Squirtle line
    { id: 7, name: "Squirtle", types: ["water"], height: "0.5 m", weight: "9.0 kg", ability: "Torrente",
      description: "Cuando se siente en peligro, se esconde dentro de su caparazón y escupe chorros de agua.",
      visualTraits: { colors: ["blue", "brown", "white"], shape: "quadruped_shell", category: "turtle", bodyStyle: "caparazon_redondo" } },
    { id: 8, name: "Wartortle", types: ["water"], height: "1.0 m", weight: "22.5 kg", ability: "Torrente",
      description: "Tiene una cola larga y cubierta de un abundante pelaje que se vuelve más oscuro con la edad.",
      visualTraits: { colors: ["blue", "brown", "white"], shape: "quadruped_shell", category: "turtle", bodyStyle: "caparazon_redondo" } },
    { id: 9, name: "Blastoise", types: ["water"], height: "1.6 m", weight: "85.5 kg", ability: "Torrente",
      description: "Blastoise tiene unos enormes cañones de agua que sobresalen de su caparazón.",
      visualTraits: { colors: ["blue", "brown", "gray"], shape: "quadruped_armored", category: "turtle", bodyStyle: "caparazon_armado" } },
    
    // Caterpie line
    { id: 10, name: "Caterpie", types: ["bug"], height: "0.3 m", weight: "2.9 kg", ability: "Polvo escudo",
      description: "Su característica más notable son sus patas cortas y rápidas. Si tocas los sensores de sus antenas, soltará un horrible olor.",
      visualTraits: { colors: ["green", "yellow", "red"], shape: "caterpillar", category: "worm", bodyStyle: "gusano_segmentado" } },
    { id: 11, name: "Metapod", types: ["bug"], height: "0.7 m", weight: "9.9 kg", ability: "Mudar",
      description: "Está esperando el momento de evolucionar. Solo es capaz de endurecer su caparazón para protegerse.",
      visualTraits: { colors: ["green"], shape: "cocoon", category: "chrysalis", bodyStyle: "capullo" } },
    { id: 12, name: "Butterfree", types: ["bug", "flying"], height: "1.1 m", weight: "32.0 kg", ability: "Ojo compuesto",
      description: "Adora el néctar de las flores. Puede localizar el polen más repleto de néctar, incluso si está a 10 km de distancia.",
      visualTraits: { colors: ["purple", "white", "black"], shape: "butterfly", category: "insect", bodyStyle: "alas_completas" } },
    
    // Weedle line
    { id: 13, name: "Weedle", types: ["bug", "poison"], height: "0.3 m", weight: "3.2 kg", ability: "Polvo escudo",
      description: "Come hojas todo el día. Puede distinguir las hojas que más le gustan por la fragancia.",
      visualTraits: { colors: ["brown", "yellow", "pink"], shape: "caterpillar", category: "worm", bodyStyle: "gusano_segmentado" } },
    { id: 14, name: "Kakuna", types: ["bug", "poison"], height: "0.6 m", weight: "10.0 kg", ability: "Mudar",
      description: "Aunque esté encerrado en su caparazón, se mueve activamente por dentro. La temperatura corporal es muy alta.",
      visualTraits: { colors: ["yellow"], shape: "cocoon", category: "chrysalis", bodyStyle: "capullo" } },
    { id: 15, name: "Beedrill", types: ["bug", "poison"], height: "1.0 m", weight: "29.5 kg", ability: "Enjambre",
      description: "Tiene tres aguijones venenosos, dos en las patas delanteras y uno en la parte inferior del abdomen.",
      visualTraits: { colors: ["yellow", "black"], shape: "wasp", category: "insect", bodyStyle: "alas_completas" } },
    
    // Pidgey line
    { id: 16, name: "Pidgey", types: ["normal", "flying"], height: "0.3 m", weight: "1.8 kg", ability: "Vista lince",
      description: "Es manso y prefiere evitar los problemas. Pero, si se le molesta, no duda en contraatacar.",
      visualTraits: { colors: ["brown", "tan", "white"], shape: "bird_small", category: "bird", bodyStyle: "pajaro_pequeno" } },
    { id: 17, name: "Pidgeotto", types: ["normal", "flying"], height: "1.1 m", weight: "30.0 kg", ability: "Vista lince",
      description: "Su visión es extraordinaria. Tiene una gran capacidad para distinguir a su presa a gran distancia.",
      visualTraits: { colors: ["brown", "tan", "red"], shape: "bird_medium", category: "bird", bodyStyle: "pajaro_mediano" } },
    { id: 18, name: "Pidgeot", types: ["normal", "flying"], height: "1.5 m", weight: "39.5 kg", ability: "Vista lince",
      description: "Este Pokémon vuela a velocidad Mach 2 en busca de presas. Sus grandes garras son muy temidas.",
      visualTraits: { colors: ["brown", "tan", "red", "yellow"], shape: "bird_large", category: "bird", bodyStyle: "pajaro_grande" } },
    
    // Rattata line
    { id: 19, name: "Rattata", types: ["normal"], height: "0.3 m", weight: "3.5 kg", ability: "Fuga",
      description: "Es capaz de roer cualquier cosa. Si ves unas rocas con marcas, son suyas.",
      visualTraits: { colors: ["purple", "white", "pink"], shape: "quadruped_small", category: "rodent", bodyStyle: "cuadrupedo_roedor" } },
    { id: 20, name: "Raticate", types: ["normal"], height: "0.7 m", weight: "18.5 kg", ability: "Fuga",
      description: "Sus colmillos crecen continuamente. Para mantenerlos afilados, roe todo tipo de cosas.",
      visualTraits: { colors: ["brown", "white", "tan"], shape: "quadruped_medium", category: "rodent", bodyStyle: "cuadrupedo_roedor" } },
    
    // Spearow line
    { id: 21, name: "Spearow", types: ["normal", "flying"], height: "0.3 m", weight: "2.0 kg", ability: "Vista lince",
      description: "Es muy protector de su territorio. Aletea muy rápido, pero no puede volar a grandes alturas.",
      visualTraits: { colors: ["brown", "tan", "red"], shape: "bird_small", category: "bird", bodyStyle: "pajaro_pequeno" } },
    { id: 22, name: "Fearow", types: ["normal", "flying"], height: "1.2 m", weight: "38.0 kg", ability: "Vista lince",
      description: "Con su gran y magnífico pico, este Pokémon puede picotear sin descanso durante todo el día.",
      visualTraits: { colors: ["brown", "tan", "red", "white"], shape: "bird_large_beak", category: "bird", bodyStyle: "pajaro_grande_pico" } },
    
    // Ekans line
    { id: 23, name: "Ekans", types: ["poison"], height: "2.0 m", weight: "6.9 kg", ability: "Intimidación",
      description: "La longitud de este Pokémon aumenta con el tiempo. Su edad se puede deducir por su longitud.",
      visualTraits: { colors: ["purple", "yellow", "black"], shape: "snake", category: "snake", bodyStyle: "serpiente" } },
    { id: 24, name: "Arbok", types: ["poison"], height: "3.5 m", weight: "65.0 kg", ability: "Intimidación",
      description: "Los dibujos de su piel tienen diferentes patrones según la zona geográfica.",
      visualTraits: { colors: ["purple", "yellow", "black", "red"], shape: "snake_large", category: "snake", bodyStyle: "serpiente_gruesa" } },
    
    // Pikachu line
    { id: 25, name: "Pikachu", types: ["electric"], height: "0.4 m", weight: "6.0 kg", ability: "Elec. estática",
      description: "Cuando se enfada, este Pokémon descarga la energía almacenada en las bolsas de sus mejillas.",
      visualTraits: { colors: ["yellow", "red", "brown"], shape: "biped_small_ears", category: "mouse", bodyStyle: "bipedo_roedor" } },
    { id: 26, name: "Raichu", types: ["electric"], height: "0.8 m", weight: "30.0 kg", ability: "Elec. estática",
      description: "Su cola descarga electricidad a tierra, protegiéndolo a sí mismo de los calambrazos.",
      visualTraits: { colors: ["orange", "yellow", "brown"], shape: "biped_medium_tail", category: "mouse", bodyStyle: "bipedo_roedor_cola" } },
    
    // Sandshrew line
    { id: 27, name: "Sandshrew", types: ["ground"], height: "0.6 m", weight: "12.0 kg", ability: "Velo arena",
      description: "Le gusta revolcarse en la arena seca para eliminar todo rastro de suciedad y humedad.",
      visualTraits: { colors: ["yellow", "tan", "white"], shape: "quadruped_small", category: "mammal", bodyStyle: "cuadrupedo_roedor" } },
    { id: 28, name: "Sandslash", types: ["ground"], height: "1.0 m", weight: "29.5 kg", ability: "Velo arena",
      description: "Es experto en trepar a los árboles. Cuando se siente amenazado, se hace un ovillo.",
      visualTraits: { colors: ["yellow", "brown", "white"], shape: "quadruped_spiky", category: "mammal", bodyStyle: "cuadrupedo_puntiagudo" } },
    
    // Nidoran line
    { id: 29, name: "Nidoran♀", types: ["poison"], height: "0.4 m", weight: "7.0 kg", ability: "Velo veneno",
      description: "Aunque pequeña, es muy valiente. Defiende su territorio sin miramientos.",
      visualTraits: { colors: ["blue", "white", "pink"], shape: "quadruped_small", category: "mammal", bodyStyle: "cuadrupedo_roedor" } },
    { id: 30, name: "Nidorina", types: ["poison"], height: "0.8 m", weight: "20.0 kg", ability: "Velo veneno",
      description: "Cuando está en familia o con sus amigos, retrae las púas para no herir a nadie.",
      visualTraits: { colors: ["blue", "white", "pink"], shape: "quadruped_medium", category: "mammal", bodyStyle: "cuadrupedo_roedor" } },
    { id: 31, name: "Nidoqueen", types: ["poison", "ground"], height: "1.3 m", weight: "60.0 kg", ability: "Velo veneno",
      description: "Su cuerpo está recubierto de púas venenosas. Nunca las usa contra su familia.",
      visualTraits: { colors: ["blue", "white", "pink", "tan"], shape: "biped_large", category: "mammal", bodyStyle: "bipedo_colmillos" } },
    { id: 32, name: "Nidoran♂", types: ["poison"], height: "0.5 m", weight: "9.0 kg", ability: "Velo veneno",
      description: "Sus grandes orejas siempre están erguidas. Si advierte un peligro, ataca con su cuerno.",
      visualTraits: { colors: ["purple", "white"], shape: "quadruped_small_horn", category: "mammal", bodyStyle: "cuadrupedo_cuerno" } },
    { id: 33, name: "Nidorino", types: ["poison"], height: "0.9 m", weight: "19.5 kg", ability: "Velo veneno",
      description: "Tiene un cuerno más duro que el de un diamante. Si siente una presencia hostil, ataca inmediatamente.",
      visualTraits: { colors: ["purple", "white"], shape: "quadruped_medium_horn", category: "mammal", bodyStyle: "cuadrupedo_cuerno" } },
    { id: 34, name: "Nidoking", types: ["poison", "ground"], height: "1.4 m", weight: "62.0 kg", ability: "Velo veneno",
      description: "Su cola es sumamente poderosa. Cuando gira, puede derribar una torre de transmisión.",
      visualTraits: { colors: ["purple", "white", "tan"], shape: "biped_large_tail", category: "mammal", bodyStyle: "bipedo_colmillos_cola" } },
    
    // Clefairy line
    { id: 35, name: "Clefairy", types: ["fairy"], height: "0.6 m", weight: "7.5 kg", ability: "Gran encanto",
      description: "Es tímido y raramente se deja ver. Si se siente a gusto, baila a la luz de la luna llena.",
      visualTraits: { colors: ["pink", "white"], shape: "biped_small_round", category: "fairy", bodyStyle: "bipedo_redondo" } },
    { id: 36, name: "Clefable", types: ["fairy"], height: "1.3 m", weight: "40.0 kg", ability: "Gran encanto",
      description: "Con su cola desarrollada puede saltar más alto que un edificio. Es muy tímido.",
      visualTraits: { colors: ["pink", "white"], shape: "biped_medium_wings", category: "fairy", bodyStyle: "bipedo_alas" } },
    
    // Vulpix line
    { id: 37, name: "Vulpix", types: ["fire"], height: "0.6 m", weight: "9.9 kg", ability: "Absorbe fuego",
      description: "De pequeño, tiene seis colas preciosas. A medida que crece, le van saliendo más.",
      visualTraits: { colors: ["orange", "brown", "white"], shape: "quadruped_fluffy", category: "fox", bodyStyle: "cuadrupedo_colas" } },
    { id: 38, name: "Ninetales", types: ["fire"], height: "1.1 m", weight: "19.9 kg", ability: "Absorbe fuego",
      description: "Cuenta la leyenda que cada una de sus nueve colas tiene un poder místico propio.",
      visualTraits: { colors: ["yellow", "white", "orange"], shape: "quadruped_elegant", category: "fox", bodyStyle: "cuadrupedo_colas" } },
    
    // Jigglypuff line
    { id: 39, name: "Jigglypuff", types: ["normal", "fairy"], height: "0.5 m", weight: "5.5 kg", ability: "Gran encanto",
      description: "Cuando este Pokémon canta, tiene un efecto hipnótico sobre quienes lo escuchan.",
      visualTraits: { colors: ["pink", "white", "blue"], shape: "biped_ball", category: "ball", bodyStyle: "esfera" } },
    { id: 40, name: "Wigglytuff", types: ["normal", "fairy"], height: "1.0 m", weight: "12.0 kg", ability: "Gran encanto",
      description: "Su cuerpo es muy elástico. Cuando se inhala profundamente, puede inflarse hasta el límite.",
      visualTraits: { colors: ["pink", "white", "blue"], shape: "biped_ball_large", category: "ball", bodyStyle: "esfera" } },
    
    // Zubat line
    { id: 41, name: "Zubat", types: ["poison", "flying"], height: "0.8 m", weight: "7.5 kg", ability: "Foco interno",
      description: "No le gusta la luz del sol. De día, permanece durmiendo colgado del techo de cuevas oscuras.",
      visualTraits: { colors: ["purple", "blue"], shape: "bat", category: "bat", bodyStyle: "alas_completas" } },
    { id: 42, name: "Golbat", types: ["poison", "flying"], height: "1.6 m", weight: "55.0 kg", ability: "Foco interno",
      description: "Cuando ataca, le encanta morder con sus colmillos venenosos. Rara vez suelta a su presa.",
      visualTraits: { colors: ["purple", "blue", "white"], shape: "bat_large", category: "bat", bodyStyle: "alas_completas" } },
    
    // Oddish line
    { id: 43, name: "Oddish", types: ["grass", "poison"], height: "0.5 m", weight: "5.4 kg", ability: "Clorofila",
      description: "Por la noche, camina unos pocos kilómetros para enterarse en la tierra y absorber nutrientes.",
      visualTraits: { colors: ["blue", "green", "red"], shape: "plant_root", category: "plant", bodyStyle: "planta_raices" } },
    { id: 44, name: "Gloom", types: ["grass", "poison"], height: "0.8 m", weight: "8.6 kg", ability: "Clorofila",
      description: "El líquido que gotea de su boca no es baba, sino néctar utilizado para atraer a la presa.",
      visualTraits: { colors: ["blue", "green", "red"], shape: "plant_flower", category: "plant", bodyStyle: "planta_flor" } },
    { id: 45, name: "Vileplume", types: ["grass", "poison"], height: "1.2 m", weight: "18.6 kg", ability: "Clorofila",
      description: "Tiene pétalos enormes. Usa los pétalos para dispersar esporas tóxicas por el aire.",
      visualTraits: { colors: ["blue", "red", "orange", "green"], shape: "plant_large_flower", category: "plant", bodyStyle: "planta_grande" } },
    
    // Paras line
    { id: 46, name: "Paras", types: ["bug", "grass"], height: "0.3 m", weight: "5.4 kg", ability: "Efecto espora",
      description: "Las setas de su espalda se alimentan de los nutrientes del huésped. Prefieren lugares húmedos.",
      visualTraits: { colors: ["red", "tan", "orange"], shape: "crab_small", category: "crustacean", bodyStyle: "multiple_patas" } },
    { id: 47, name: "Parasect", types: ["bug", "grass"], height: "1.0 m", weight: "29.5 kg", ability: "Efecto espora",
      description: "La seta gigante en su espalda controla a este Pokémon. Esparce esporas tóxicas.",
      visualTraits: { colors: ["red", "tan", "white"], shape: "crab_mushroom", category: "crustacean", bodyStyle: "multiple_patas_hongo" } },
    
    // Venonat line
    { id: 48, name: "Venonat", types: ["bug", "poison"], height: "1.0 m", weight: "30.0 kg", ability: "Ojo compuesto",
      description: "Sus grandes ojos actúan como radares. En lugares oscuros, lanza luz por los ojos.",
      visualTraits: { colors: ["purple", "red", "white"], shape: "bug_fuzzy", category: "insect", bodyStyle: "multiple_patas" } },
    { id: 49, name: "Venomoth", types: ["bug", "poison"], height: "1.5 m", weight: "12.5 kg", ability: "Polvo escudo",
      description: "Las alas están cubiertas de escamas como polvo. Si se agita las alas, esparce polvillo tóxico.",
      visualTraits: { colors: ["purple", "white", "pink"], shape: "moth", category: "insect", bodyStyle: "alas_completas" } },
    
    // Diglett line
    { id: 50, name: "Diglett", types: ["ground"], height: "0.2 m", weight: "0.8 kg", ability: "Velo arena",
      description: "Vive bajo tierra. Se alimenta de raíces de plantas. A veces sale a la superficie.",
      visualTraits: { colors: ["brown", "pink", "white"], shape: "head_only", category: "mole", bodyStyle: "cabeza_sola" } },
    { id: 51, name: "Dugtrio", types: ["ground"], height: "0.7 m", weight: "33.3 kg", ability: "Velo arena",
      description: "Son trillizos que emergieron de un mismo cuerpo. Trabajan en equipo para cavar túneles.",
      visualTraits: { colors: ["brown", "pink", "white"], shape: "three_heads", category: "mole", bodyStyle: "cabeza_sola" } },
    
    // Meowth line
    { id: 52, name: "Meowth", types: ["normal"], height: "0.4 m", weight: "4.2 kg", ability: "Recogida",
      description: "Este Pokémon adora las cosas brillantes. De noche, se levanta y deambula, robando objetos que brillan.",
      visualTraits: { colors: ["tan", "cream", "gold"], shape: "biped_cat", category: "cat", bodyStyle: "bipedo_redondo" } },
    { id: 53, name: "Persian", types: ["normal"], height: "1.0 m", weight: "32.0 kg", ability: "Flexibilidad",
      description: "A pesar de su elegante aspecto, es muy violento. Las uñas de las patas son muy afiladas.",
      visualTraits: { colors: ["tan", "cream", "red", "gold"], shape: "quadruped_cat_elegant", category: "cat", bodyStyle: "cuadrupedo_felino" } },
    
    // Psyduck line
    { id: 54, name: "Psyduck", types: ["water"], height: "0.8 m", weight: "19.6 kg", ability: "Humedad",
      description: "Sufre constantemente de dolor de cabeza. Cuando éste se hace muy intenso, empieza a usar poderes psicoquinéticos.",
      visualTraits: { colors: ["yellow", "cream"], shape: "biped_plump", category: "duck", bodyStyle: "bipedo_redondo" } },
    { id: 55, name: "Golduck", types: ["water"], height: "1.7 m", weight: "76.6 kg", ability: "Nado rápido",
      description: "Nada elegantemente por los lagos. Este Pokémon es mucho más rápido que los mejores nadadores humanos.",
      visualTraits: { colors: ["blue", "cream", "red"], shape: "biped_athletic", category: "duck", bodyStyle: "bipedo_cresta" } },
    
    // Mankey line
    { id: 56, name: "Mankey", types: ["fighting"], height: "0.5 m", weight: "28.0 kg", ability: "Espíritu vital",
      description: "Es muy ágil. Si se enfada, se vuelve más rápido y fuerte. Pero se calma inmediatamente si se va.",
      visualTraits: { colors: ["tan", "brown", "cream"], shape: "biped_monkey", category: "monkey", bodyStyle: "bipedo_mono" } },
    { id: 57, name: "Primeape", types: ["fighting"], height: "1.0 m", weight: "32.0 kg", ability: "Espíritu vital",
      description: "Si se enfurece, no se calma hasta que haya dado caza a su oponente. Es muy difícil de controlar.",
      visualTraits: { colors: ["tan", "brown", "white"], shape: "biped_angry", category: "monkey", bodyStyle: "bipedo_mono" } },
    
    // Growlithe line
    { id: 58, name: "Growlithe", types: ["fire"], height: "0.7 m", weight: "19.0 kg", ability: "Intimidación",
      description: "Tiene una naturaleza valiente y fiel. Se pone furioso cuando le hacen enfadar.",
      visualTraits: { colors: ["orange", "black", "tan"], shape: "quadruped_dog", category: "dog", bodyStyle: "cuadrupedo_canino" } },
    { id: 59, name: "Arcanine", types: ["fire"], height: "1.9 m", weight: "155.0 kg", ability: "Intimidación",
      description: "Este Pokémon es legendario por su belleza. Corre tan rápido que muchos creen que está volando.",
      visualTraits: { colors: ["orange", "black", "tan", "cream"], shape: "quadruped_majestic", category: "dog", bodyStyle: "cuadrupedo_canino" } },
    
    // Poliwag line
    { id: 60, name: "Poliwag", types: ["water"], height: "0.6 m", weight: "12.4 kg", ability: "Humedad",
      description: "La dirección del espiral en el vientre cambia según el hemisferio donde nace.",
      visualTraits: { colors: ["blue", "white", "black"], shape: "tadpole", category: "amphibian", bodyStyle: "cabeza_con_patas" } },
    { id: 61, name: "Poliwhirl", types: ["water"], height: "1.0 m", weight: "20.0 kg", ability: "Humedad",
      description: "Cuando está en peligro, transpira una sustancia espesa y viscosa que le protege de sus enemigos.",
      visualTraits: { colors: ["blue", "white", "black"], shape: "biped_frog", category: "amphibian", bodyStyle: "bipedo_redondo" } },
    { id: 62, name: "Poliwrath", types: ["water", "fighting"], height: "1.3 m", weight: "54.0 kg", ability: "Humedad",
      description: "Es un nadador experto. Puede nadar a gran velocidad usando todos sus músculos.",
      visualTraits: { colors: ["blue", "white", "black"], shape: "biped_muscular", category: "amphibian", bodyStyle: "bipedo_musculoso" } },
    
    // Abra line
    { id: 63, name: "Abra", types: ["psychic"], height: "0.9 m", weight: "19.5 kg", ability: "Sincronía",
      description: "Este Pokémon duerme 18 horas al día. Puede detectar cualquier peligro mientras duerme.",
      visualTraits: { colors: ["yellow", "brown"], shape: "biped_small", category: "humanoid", bodyStyle: "bipedo_colas" } },
    { id: 64, name: "Kadabra", types: ["psychic"], height: "1.3 m", weight: "56.5 kg", ability: "Sincronía",
      description: "Emite ondas alfa especiales cuando tiene el cerebro activo. Puede causar dolores de cabeza.",
      visualTraits: { colors: ["yellow", "brown", "gray"], shape: "biped_mustache", category: "humanoid", bodyStyle: "bipedo_bigote" } },
    { id: 65, name: "Alakazam", types: ["psychic"], height: "1.5 m", weight: "48.0 kg", ability: "Sincronía",
      description: "Tiene un coeficiente intelectual de 5.000. La inteligencia crece continuamente.",
      visualTraits: { colors: ["yellow", "brown", "gray"], shape: "biped_spoons", category: "humanoid", bodyStyle: "bipedo_bigote_cucharas" } },
    
    // Machop line
    { id: 66, name: "Machop", types: ["fighting"], height: "0.8 m", weight: "19.5 kg", ability: "Agallas",
      description: "Sus músculos nunca se fatigan, por mucho que entrenen. Tiene una fuerza sobrehumana.",
      visualTraits: { colors: ["gray", "blue", "red"], shape: "biped_muscular", category: "humanoid", bodyStyle: "bipedo_musculoso" } },
    { id: 67, name: "Machoke", types: ["fighting"], height: "1.5 m", weight: "70.5 kg", ability: "Agallas",
      description: "Su cuerpo muscular nunca se cansa. Usa un cinturón de fuerza para contener su energía.",
      visualTraits: { colors: ["gray", "blue", "red"], shape: "biped_belt", category: "humanoid", bodyStyle: "bipedo_musculoso" } },
    { id: 68, name: "Machamp", types: ["fighting"], height: "1.6 m", weight: "130.0 kg", ability: "Agallas",
      description: "Tiene cuatro brazos que puede usar para lanzar potentes golpes desde cualquier ángulo.",
      visualTraits: { colors: ["gray", "blue", "red", "gold"], shape: "biped_four_arms", category: "humanoid", bodyStyle: "bipedo_multiples_brazos" } },
    
    // Bellsprout line
    { id: 69, name: "Bellsprout", types: ["grass", "poison"], height: "0.7 m", weight: "4.0 kg", ability: "Clorofila",
      description: "Prefiere lugares cálidos y húmedos. Atrapa insectos pequeños con sus lianas.",
      visualTraits: { colors: ["green", "yellow", "brown"], shape: "plant_sprout", category: "plant", bodyStyle: "planta_tallo" } },
    { id: 70, name: "Weepinbell", types: ["grass", "poison"], height: "1.0 m", weight: "6.4 kg", ability: "Clorofila",
      description: "Escupe una sustancia corrosiva para disolver a su presa. No tiene patas, solo raíces.",
      visualTraits: { colors: ["green", "yellow"], shape: "plant_bell", category: "plant", bodyStyle: "planta_tallo" } },
    { id: 71, name: "Victreebel", types: ["grass", "poison"], height: "1.7 m", weight: "15.5 kg", ability: "Clorofila",
      description: "Atrapa a su presa con su aroma dulce y luego la disuelve con ácido.",
      visualTraits: { colors: ["green", "yellow"], shape: "plant_pitcher", category: "plant", bodyStyle: "planta_tallo" } },
    
    // Tentacool line
    { id: 72, name: "Tentacool", types: ["water", "poison"], height: "0.9 m", weight: "45.5 kg", ability: "Cura lluvia",
      description: "Flota en el agua a la deriva. Si lo tocas accidentalmente, puede causar una erupción dolorosa.",
      visualTraits: { colors: ["blue", "red", "white"], shape: "jellyfish", category: "cnidarian", bodyStyle: "tentaculos" } },
    { id: 73, name: "Tentacruel", types: ["water", "poison"], height: "1.6 m", weight: "55.0 kg", ability: "Cuerpo líquido",
      description: "Tiene 80 tentáculos que se mueven libremente. Puede absorber agua y crecer.",
      visualTraits: { colors: ["blue", "red", "white"], shape: "jellyfish_large", category: "cnidarian", bodyStyle: "tentaculos" } },
    
    // Geodude line
    { id: 74, name: "Geodude", types: ["rock", "ground"], height: "0.4 m", weight: "20.0 kg", ability: "Cabeza roca",
      description: "La mitad de su cuerpo está enterrada en el suelo. Cuando duerme, se confunde con una roca.",
      visualTraits: { colors: ["gray", "brown"], shape: "floating_rock", category: "mineral", bodyStyle: "cabeza_con_brazos" } },
    { id: 75, name: "Graveler", types: ["rock", "ground"], height: "1.0 m", weight: "105.0 kg", ability: "Cabeza roca",
      description: "Le gusta rodar por las laderas de las montañas. Su cuerpo es cada vez más duro.",
      visualTraits: { colors: ["gray", "brown"], shape: "boulder", category: "mineral", bodyStyle: "multiple_patas" } },
    { id: 76, name: "Golem", types: ["rock", "ground"], height: "1.4 m", weight: "300.0 kg", ability: "Cabeza roca",
      description: "Su cuerpo es tan duro como el diamante. Puede soportar explosiones sin daño.",
      visualTraits: { colors: ["gray", "brown", "green"], shape: "boulder_turtle", category: "mineral", bodyStyle: "caparazon" } },
    
    // Ponyta line
    { id: 77, name: "Ponyta", types: ["fire"], height: "1.0 m", weight: "30.0 kg", ability: "Fuga",
      description: "Sus pezuñas son 10 veces más duras que el diamante. Puede dar saltos increíbles.",
      visualTraits: { colors: ["yellow", "orange", "red"], shape: "horse_small", category: "horse", bodyStyle: "cuadrupedo_caballo" } },
    { id: 78, name: "Rapidash", types: ["fire"], height: "1.7 m", weight: "95.0 kg", ability: "Fuga",
      description: "Corre a gran velocidad. Siempre quiere correr más rápido que cualquier otra cosa.",
      visualTraits: { colors: ["orange", "red", "yellow", "white"], shape: "horse_unicorn", category: "horse", bodyStyle: "cuadrupedo_caballo" } },
    
    // Slowpoke line
    { id: 79, name: "Slowpoke", types: ["water", "psychic"], height: "1.2 m", weight: "36.0 kg", ability: "Despiste",
      description: "Es increíblemente lento y perezoso. Tarda cinco segundos en sentir dolor.",
      visualTraits: { colors: ["pink", "cream"], shape: "quadruped_lazy", category: "hippo", bodyStyle: "cuadrupedo_redondo" } },
    { id: 80, name: "Slowbro", types: ["water", "psychic"], height: "1.6 m", weight: "78.5 kg", ability: "Despiste",
      description: "Shellder se mordió la cola y no la suelta. Slowbro ya no puede pescar con la cola.",
      visualTraits: { colors: ["pink", "cream", "gray"], shape: "biped_shell", category: "hippo", bodyStyle: "bipedo_con_caparazon" } },
    
    // Magnemite line
    { id: 81, name: "Magnemite", types: ["electric", "steel"], height: "0.3 m", weight: "6.0 kg", ability: "Imán",
      description: "Emite ondas electromagnéticas que pueden oscurecer las televisiones cercanas.",
      visualTraits: { colors: ["gray", "red", "blue"], shape: "magnet_ball", category: "machine", bodyStyle: "esfera" } },
    { id: 82, name: "Magneton", types: ["electric", "steel"], height: "1.0 m", weight: "60.0 kg", ability: "Imán",
      description: "Tres Magnemite se unen por las fuerzas magnéticas. Genera ondas de radio potentes.",
      visualTraits: { colors: ["gray", "red", "blue"], shape: "magnet_three", category: "machine", bodyStyle: "esfera" } },
    
    // Farfetch'd
    { id: 83, name: "Farfetch'd", types: ["normal", "flying"], height: "0.8 m", weight: "15.0 kg", ability: "Foco interno",
      description: "Nunca vive sin su cebollera. Si se la quitan, se negará a hacer nada.",
      visualTraits: { colors: ["brown", "white", "green"], shape: "bird_duck", category: "bird", bodyStyle: "alas_completas" } },
    
    // Doduo line
    { id: 84, name: "Doduo", types: ["normal", "flying"], height: "1.4 m", weight: "39.2 kg", ability: "Fuga",
      description: "Sus dos cabezas nunca duermen al mismo tiempo. Sus cortas alas no le permiten volar bien.",
      visualTraits: { colors: ["brown", "tan", "black"], shape: "bird_two_heads", category: "bird", bodyStyle: "dos_cabezas" } },
    { id: 85, name: "Dodrio", types: ["normal", "flying"], height: "1.8 m", weight: "85.2 kg", ability: "Fuga",
      description: "Tres cerebros independientes controlan sus cabezas. Siempre están discutiendo.",
      visualTraits: { colors: ["brown", "tan", "black"], shape: "bird_three_heads", category: "bird", bodyStyle: "tres_cabezas" } },
    
    // Seel line
    { id: 86, name: "Seel", types: ["water"], height: "1.1 m", weight: "90.0 kg", ability: "Sebo",
      description: "Le encanta el frío. Nada alegremente en aguas heladas a -40 grados.",
      visualTraits: { colors: ["white", "tan"], shape: "seal", category: "seal", bodyStyle: "aletas" } },
    { id: 87, name: "Dewgong", types: ["water", "ice"], height: "1.7 m", weight: "120.0 kg", ability: "Sebo",
      description: "Su cuerpo es tan blanco como la nieve. No se nota en invierno.",
      visualTraits: { colors: ["white", "tan"], shape: "seal_large", category: "seal", bodyStyle: "aletas" } },
    
    // Grimer line
    { id: 88, name: "Grimer", types: ["poison"], height: "0.9 m", weight: "30.0 kg", ability: "Hedor",
      description: "Nacido de lodo contaminado. Le encanta cualquier cosa sucia y olorosa.",
      visualTraits: { colors: ["purple", "gray"], shape: "blob", category: "sludge", bodyStyle: "cabeza_sola" } },
    { id: 89, name: "Muk", types: ["poison"], height: "1.2 m", weight: "30.0 kg", ability: "Hedor",
      description: "Tan hediondo que puede causar desmayos. Se alimenta de residuos y basura.",
      visualTraits: { colors: ["purple", "yellow", "gray"], shape: "blob_large", category: "sludge", bodyStyle: "cabeza_sola" } },
    
    // Shellder line
    { id: 90, name: "Shellder", types: ["water"], height: "0.3 m", weight: "4.0 kg", ability: "Caparazón",
      description: "Su concha puede nadar hacia atrás abriendo y cerrando rápidamente.",
      visualTraits: { colors: ["purple", "black", "pearl"], shape: "shell", category: "mollusk", bodyStyle: "caparazon" } },
    { id: 91, name: "Cloyster", types: ["water", "ice"], height: "1.5 m", weight: "132.5 kg", ability: "Caparazón",
      description: "Una vez cerrada, su concha es imposible de abrir con golpes ordinarios.",
      visualTraits: { colors: ["purple", "black"], shape: "spiked_shell", category: "mollusk", bodyStyle: "caparazon" } },
    
    // Gastly line
    { id: 92, name: "Gastly", types: ["ghost", "poison"], height: "1.3 m", weight: "0.1 kg", ability: "Levitar",
      description: "Su cuerpo gaseoso puede atravesar cualquier cosa. Puede derribar a un elefante indio con su gas venenoso.",
      visualTraits: { colors: ["purple", "black"], shape: "gas_orb", category: "ghost", bodyStyle: "cabeza_sola" } },
    { id: 93, name: "Haunter", types: ["ghost", "poison"], height: "1.6 m", weight: "0.1 kg", ability: "Levitar",
      description: "Si te atrapa y te sacude, no harás más que dormir para siempre.",
      visualTraits: { colors: ["purple", "black", "red"], shape: "gas_hands", category: "ghost", bodyStyle: "cabeza_con_brazos" } },
    { id: 94, name: "Gengar", types: ["ghost", "poison"], height: "1.5 m", weight: "40.5 kg", ability: "Levitar",
      description: "Para robarle la vida a su objetivo, se desliza en su sombra y espera en silencio.",
      visualTraits: { colors: ["purple", "red", "black"], shape: "shadow_cat", category: "ghost", bodyStyle: "bipedo_redondo" } },
    
    // Onix
    { id: 95, name: "Onix", types: ["rock", "ground"], height: "8.8 m", weight: "210.0 kg", ability: "Cabeza roca",
      description: "Su cerebro tiene un imán que le sirve de brújula para no perderse mientras cava túneles.",
      visualTraits: { colors: ["gray", "black"], shape: "rock_snake", category: "mineral", bodyStyle: "serpiente" } },
    
    // Drowzee line
    { id: 96, name: "Drowzee", types: ["psychic"], height: "1.0 m", weight: "32.4 kg", ability: "Insomnio",
      description: "Si duermes cerca de uno todo el tiempo, a veces te mostrará los sueños que se ha comido.",
      visualTraits: { colors: ["yellow", "tan", "brown"], shape: "biped_tapir", category: "mammal", bodyStyle: "bipedo_redondo" } },
    { id: 97, name: "Hypno", types: ["psychic"], height: "1.6 m", weight: "75.6 kg", ability: "Insomnio",
      description: "Evita mirar los péndulos que lleva. Puede hipnotizarte en un segundo.",
      visualTraits: { colors: ["yellow", "tan", "white"], shape: "biped_pendulum", category: "humanoid", bodyStyle: "bipedo_colas" } },
    
    // Krabby line
    { id: 98, name: "Krabby", types: ["water"], height: "0.4 m", weight: "6.5 kg", ability: "Corte fuerte",
      description: "Sus pinzas son muy poderosas. Si se le cae una, le crece otra igual de fuerte.",
      visualTraits: { colors: ["red", "tan", "white"], shape: "crab_small", category: "crustacean", bodyStyle: "multiple_patas" } },
    { id: 99, name: "Kingler", types: ["water"], height: "1.3 m", weight: "60.0 kg", ability: "Corte fuerte",
      description: "Tiene una pinza gigante de 10.000 caballos de fuerza. Pero es tan pesada que le cuesta moverla.",
      visualTraits: { colors: ["red", "tan"], shape: "crab_large_claw", category: "crustacean", bodyStyle: "multiple_patas" } },
    
    // Voltorb line
    { id: 100, name: "Voltorb", types: ["electric"], height: "0.5 m", weight: "10.4 kg", ability: "Elec. estática",
      description: "Se dice que es una Poké Ball expuesta a un fuerte pulso de energía.",
      visualTraits: { colors: ["red", "white"], shape: "ball", category: "ball", bodyStyle: "esfera" } },
    { id: 101, name: "Electrode", types: ["electric"], height: "1.2 m", weight: "66.6 kg", ability: "Elec. estática",
      description: "Se alimenta de electricidad atmosférica. Explota al menor estímulo.",
      visualTraits: { colors: ["white", "red", "black"], shape: "ball_large", category: "ball", bodyStyle: "esfera" } },
    
    // Exeggcute line
    { id: 102, name: "Exeggcute", types: ["grass", "psychic"], height: "0.4 m", weight: "2.5 kg", ability: "Clorofila",
      description: "Seis huevos se comunican telepáticamente. Si se separan, se vuelven más fuertes.",
      visualTraits: { colors: ["pink", "yellow", "beige"], shape: "cluster_eggs", category: "plant", bodyStyle: "cabeza_sola" } },
    { id: 103, name: "Exeggutor", types: ["grass", "psychic"], height: "2.0 m", weight: "120.0 kg", ability: "Clorofila",
      description: "Cabeza que piensa de forma independiente. Si una cabeza cae, se convierte en Exeggcute.",
      visualTraits: { colors: ["yellow", "brown", "green"], shape: "palm_tree_heads", category: "plant", bodyStyle: "planta_tallo" } },
    
    // Cubone line
    { id: 104, name: "Cubone", types: ["ground"], height: "0.4 m", weight: "6.5 kg", ability: "Cabeza roca",
      description: "Lleva el cráneo de su difunta madre. Llora por las noches por ella.",
      visualTraits: { colors: ["brown", "tan", "cream"], shape: "biped_skull", category: "mammal", bodyStyle: "bipedo_redondo" } },
    { id: 105, name: "Marowak", types: ["ground"], height: "1.0 m", weight: "45.0 kg", ability: "Cabeza roca",
      description: "Su cuerpo se ha endurecido y el cráneo está fusionado a su cabeza.",
      visualTraits: { colors: ["brown", "tan", "cream"], shape: "biped_bone", category: "mammal", bodyStyle: "bipedo_colas" } },
    
    // Hitmonlee
    { id: 106, name: "Hitmonlee", types: ["fighting"], height: "1.5 m", weight: "49.8 kg", ability: "Flexibilidad",
      description: "Sus piernas pueden contraerse y estirarse libremente. Patea a gran velocidad.",
      visualTraits: { colors: ["brown", "tan"], shape: "biped_long_legs", category: "humanoid", bodyStyle: "bipedo_piernas" } },
    
    // Hitmonchan
    { id: 107, name: "Hitmonchan", types: ["fighting"], height: "1.4 m", weight: "50.2 kg", ability: "Puño férreo",
      description: "Sus puñetazos son tan rápidos que ni siquiera se pueden ver. Puede perforar hormigón.",
      visualTraits: { colors: ["brown", "tan", "purple", "white"], shape: "biped_boxer", category: "humanoid", bodyStyle: "bipedo_musculoso" } },
    
    // Lickitung
    { id: 108, name: "Lickitung", types: ["normal"], height: "1.2 m", weight: "65.5 kg", ability: "Despiste",
      description: "Su lengua mide dos metros. Usa su lengua para manejar cosas y atacar.",
      visualTraits: { colors: ["pink", "white"], shape: "biped_long_tongue", category: "lizard", bodyStyle: "bipedo_redondo" } },
    
    // Koffing line
    { id: 109, name: "Koffing", types: ["poison"], height: "0.6 m", weight: "1.0 kg", ability: "Levitar",
      description: "Su cuerpo contiene gases tóxicos. Puede explotar si se le agita demasiado.",
      visualTraits: { colors: ["purple", "gray", "white"], shape: "gas_ball", category: "gas", bodyStyle: "esfera" } },
    { id: 110, name: "Weezing", types: ["poison"], height: "1.2 m", weight: "9.5 kg", ability: "Levitar",
      description: "Dos Koffing se fusionaron creando gases más tóxicos por sus reacciones químicas.",
      visualTraits: { colors: ["purple", "gray", "white"], shape: "gas_two_balls", category: "gas", bodyStyle: "esfera" } },
    
    // Rhyhorn line
    { id: 111, name: "Rhyhorn", types: ["ground", "rock"], height: "1.0 m", weight: "115.0 kg", ability: "Cabeza roca",
      description: "Su cuerpo es muy duro. Puede derribar un edificio cargando contra él.",
      visualTraits: { colors: ["gray", "black"], shape: "quadruped_armored", category: "rhino", bodyStyle: "cuadrupedo_grande" } },
    { id: 112, name: "Rhydon", types: ["ground", "rock"], height: "1.9 m", weight: "120.0 kg", ability: "Cabeza roca",
      description: "Sus cuernos pueden agujerear diamantes. Puede caminar en magma sin quemarse.",
      visualTraits: { colors: ["gray", "black", "cream"], shape: "biped_drill", category: "rhino", bodyStyle: "bipedo_grande" } },
    
    // Chansey
    { id: 113, name: "Chansey", types: ["normal"], height: "1.1 m", weight: "34.6 kg", ability: "Cura natural",
      description: "Un Pokémon gentil que reparte huevos nutritivos a los heridos.",
      visualTraits: { colors: ["pink", "white"], shape: "biped_oval", category: "fairy", bodyStyle: "bipedo_redondo" } },
    
    // Tangela
    { id: 114, name: "Tangela", types: ["grass"], height: "1.0 m", weight: "35.0 kg", ability: "Clorofila",
      description: "Cubierto de enredaderas azules que crecen constantemente. Nadie ha visto su cara.",
      visualTraits: { colors: ["blue", "red"], shape: "vine_cluster", category: "plant", bodyStyle: "planta_tallo" } },
    
    // Kangaskhan
    { id: 115, name: "Kangaskhan", types: ["normal"], height: "2.2 m", weight: "80.0 kg", ability: "Foco interno",
      description: "Lleva a su cría en la bolsa de la panza. Nunca deja que le pase nada malo.",
      visualTraits: { colors: ["brown", "tan", "cream"], shape: "biped_pouch", category: "kangaroo", bodyStyle: "bipedo_con_bolsa" } },
    
    // Horsea line
    { id: 116, name: "Horsea", types: ["water"], height: "0.4 m", weight: "8.0 kg", ability: "Nado rápido",
      description: "Nada hacia atrás usando su aleta dorsal. Dispara tinta desde su boca.",
      visualTraits: { colors: ["blue", "yellow", "white"], shape: "seahorse", category: "seahorse", bodyStyle: "cabeza_con_patas" } },
    { id: 117, name: "Seadra", types: ["water"], height: "1.2 m", weight: "25.0 kg", ability: "Veneno punto",
      description: "Sus aletas pectorales han crecido. Puede nadar a contracorriente.",
      visualTraits: { colors: ["blue", "yellow", "white"], shape: "seahorse_spiny", category: "seahorse", bodyStyle: "cabeza_con_patas" } },
    
    // Goldeen line
    { id: 118, name: "Goldeen", types: ["water"], height: "0.6 m", weight: "15.0 kg", ability: "Nado rápido",
      description: "Su aleta dorsal y su cola se parecen a un vestido de novia. Es muy elegante.",
      visualTraits: { colors: ["white", "red", "orange"], shape: "fish", category: "fish", bodyStyle: "aletas" } },
    { id: 119, name: "Seaking", types: ["water"], height: "1.3 m", weight: "39.0 kg", ability: "Nado rápido",
      description: "El cuerno de su cabeza puede taladrar agujeros en rocas de los acantilados.",
      visualTraits: { colors: ["white", "red", "orange"], shape: "fish_horn", category: "fish", bodyStyle: "aletas" } },
    
    // Staryu line
    { id: 120, name: "Staryu", types: ["water"], height: "0.8 m", weight: "34.5 kg", ability: "Cura natural",
      description: "Su núcleo rojo brilla con los siete colores del arcoíris cuando está sano.",
      visualTraits: { colors: ["brown", "gold", "red"], shape: "star", category: "starfish", bodyStyle: "multiple_patas" } },
    { id: 121, name: "Starmie", types: ["water", "psychic"], height: "1.1 m", weight: "80.0 kg", ability: "Cura natural",
      description: "Su núcleo central emite misteriosas señales de radio en la noche.",
      visualTraits: { colors: ["purple", "gold"], shape: "star", category: "starfish", bodyStyle: "multiple_patas" } },
    
    // Mr. Mime
    { id: 122, name: "Mr. Mime", types: ["psychic", "fairy"], height: "1.3 m", weight: "54.5 kg", ability: "Filtro",
      description: "Experta en mímica. Siempre hace barreras invisibles para no mancharse.",
      visualTraits: { colors: ["pink", "red", "blue", "white"], shape: "biped_mime", category: "humanoid", bodyStyle: "bipedo_redondo" } },
    
    // Scyther
    { id: 123, name: "Scyther", types: ["bug", "flying"], height: "1.5 m", weight: "56.0 kg", ability: "Cromolente",
      description: "Sus guadañas son muy afiladas. Se afilan más con cada combate.",
      visualTraits: { colors: ["green", "cream", "white"], shape: "mantis", category: "insect", bodyStyle: "alas_completas" } },
    
    // Jynx
    { id: 124, name: "Jynx", types: ["ice", "psychic"], height: "1.4 m", weight: "40.6 kg", ability: "Despiste",
      description: "Baila de forma extraña. Sus movimientos son muy rítmicos.",
      visualTraits: { colors: ["red", "white", "blonde"], shape: "biped_humanoid", category: "humanoid", bodyStyle: "bipedo_largo" } },
    
    // Electabuzz
    { id: 125, name: "Electabuzz", types: ["electric"], height: "1.1 m", weight: "30.0 kg", ability: "Elec. estática",
      description: "Le encanta la electricidad. Se acerca a las torres de alta tensión.",
      visualTraits: { colors: ["yellow", "black"], shape: "biped_tiger", category: "tiger", bodyStyle: "bipedo_colas" } },
    
    // Magmar
    { id: 126, name: "Magmar", types: ["fire"], height: "1.3 m", weight: "44.5 kg", ability: "Cuerpo llama",
      description: "Su cuerpo arde a 2,200 grados. Nace cerca de volcanes activos.",
      visualTraits: { colors: ["red", "orange", "yellow"], shape: "biped_duck", category: "duck", bodyStyle: "bipedo_redondo" } },
    
    // Pinsir
    { id: 127, name: "Pinsir", types: ["bug"], height: "1.5 m", weight: "55.0 kg", ability: "Corte fuerte",
      description: "Sus pinzas pueden agarrar al enemigo con 1 tonelada de presión.",
      visualTraits: { colors: ["brown", "tan"], shape: "beetle_horns", category: "beetle", bodyStyle: "multiple_patas" } },
    
    // Tauros
    { id: 128, name: "Tauros", types: ["normal"], height: "1.4 m", weight: "88.4 kg", ability: "Intimidación",
      description: "Carga a gran velocidad. Tiene tres colas que usa para azotarse.",
      visualTraits: { colors: ["brown", "tan", "black"], shape: "bull", category: "bull", bodyStyle: "cuadrupedo_cuernos" } },
    
    // Magikarp line
    { id: 129, name: "Magikarp", types: ["water"], height: "0.9 m", weight: "10.0 kg", ability: "Nado rápido",
      description: "Este Pokémon es prácticamente inútil. Solo puede chapotear y hacer cara de sorpresa.",
      visualTraits: { colors: ["red", "gold", "white"], shape: "fish_simple", category: "fish", bodyStyle: "aletas" } },
    { id: 130, name: "Gyarados", types: ["water", "flying"], height: "6.5 m", weight: "235.0 kg", ability: "Nado rápido",
      description: "Tiene una naturaleza muy agresiva. La evolución cambió drásticamente su estructura celular.",
      visualTraits: { colors: ["blue", "gold", "red", "white"], shape: "dragon_serpent", category: "dragon", bodyStyle: "serpiente" } },
    
    // Lapras
    { id: 131, name: "Lapras", types: ["water", "ice"], height: "2.5 m", weight: "220.0 kg", ability: "Absorbe agua",
      description: "Este Pokémon gentil transporta a la gente sobre su caparazón a través del mar.",
      visualTraits: { colors: ["blue", "gray", "cream"], shape: "plesiosaur", category: "dinosaur", bodyStyle: "caparazon" } },
    
    // Ditto
    { id: 132, name: "Ditto", types: ["normal"], height: "0.3 m", weight: "4.0 kg", ability: "Flexibilidad",
      description: "Puede alterar su estructura celular para convertirse en cualquier forma.",
      visualTraits: { colors: ["purple", "pink"], shape: "blob", category: "amorphous", bodyStyle: "cabeza_sola" } },
    
    // Eevee line
    { id: 133, name: "Eevee", types: ["normal"], height: "0.3 m", weight: "6.5 kg", ability: "Fuga",
      description: "Gracias a su inestable código genético, Eevee tiene el potencial de evolucionar en cualquier Pokémon.",
      visualTraits: { colors: ["brown", "tan", "cream"], shape: "quadruped_fluffy", category: "fox", bodyStyle: "cuadrupedo_colas" } },
    { id: 134, name: "Vaporeon", types: ["water"], height: "1.0 m", weight: "29.0 kg", ability: "Absorbe agua",
      description: "Vaporeon vive cerca del agua. Su cola se parece a la de una sirena.",
      visualTraits: { colors: ["blue", "white", "darkblue"], shape: "quadruped_fins", category: "fox", bodyStyle: "cuadrupedo_aletas" } },
    { id: 135, name: "Jolteon", types: ["electric"], height: "0.8 m", weight: "24.5 kg", ability: "Absorbe elec",
      description: "Las células de su cuerpo generan corriente eléctrica. Su pelaje erizado detecta electricidad.",
      visualTraits: { colors: ["yellow", "white", "black"], shape: "quadruped_spiky", category: "fox", bodyStyle: "cuadrupedo_puntiagudo" } },
    { id: 136, name: "Flareon", types: ["fire"], height: "0.9 m", weight: "25.0 kg", ability: "Absorbe fuego",
      description: "Almacena aire caliente en su pelaje y lo usa para regular su temperatura corporal.",
      visualTraits: { colors: ["red", "orange", "yellow"], shape: "quadruped_fluffy", category: "fox", bodyStyle: "cuadrupedo_colas" } },
    
    // Porygon
    { id: 137, name: "Porygon", types: ["normal"], height: "0.8 m", weight: "36.5 kg", ability: "Rastro",
      description: "El primer Pokémon creado artificialmente. Puede entrar en el ciberespacio.",
      visualTraits: { colors: ["pink", "blue"], shape: "bird_digital", category: "virtual", bodyStyle: "alas_completas" } },
    
    // Omanyte line
    { id: 138, name: "Omanyte", types: ["rock", "water"], height: "0.4 m", weight: "7.5 kg", ability: "Nado rápido",
      description: "Un Pokémon prehistórico resucitado de un fósil. Nada con sus 10 tentáculos.",
      visualTraits: { colors: ["blue", "tan"], shape: "spiral_shell", category: "ammonite", bodyStyle: "caparazon" } },
    { id: 139, name: "Omastar", types: ["rock", "water"], height: "1.0 m", weight: "35.0 kg", ability: "Nado rápido",
      description: "Sus tentáculos se desarrollaron y afilados. Muerde con sus picos afilados.",
      visualTraits: { colors: ["blue", "tan", "yellow"], shape: "spiral_shell_spikes", category: "ammonite", bodyStyle: "caparazon" } },
    
    // Kabuto line
    { id: 140, name: "Kabuto", types: ["rock", "water"], height: "0.5 m", weight: "11.5 kg", ability: "Nado rápido",
      description: "Resucitado de un fósil. Se protege con su caparazón duro como el hierro.",
      visualTraits: { colors: ["brown", "tan", "black"], shape: "horseshoe_crab", category: "crustacean", bodyStyle: "caparazon" } },
    { id: 141, name: "Kabutops", types: ["rock", "water"], height: "1.3 m", weight: "40.5 kg", ability: "Nado rápido",
      description: "Evolucionó para poder caminar. Sus guadañas son armas perfectas.",
      visualTraits: { colors: ["brown", "tan", "white"], shape: "humanoid_scythes", category: "crustacean", bodyStyle: "bipedo_garras" } },
    
    // Aerodactyl
    { id: 142, name: "Aerodactyl", types: ["rock", "flying"], height: "1.8 m", weight: "59.0 kg", ability: "Cabeza roca",
      description: "Un feroz Pokémon prehistórico. Algunos afirman haberlo visto volando.",
      visualTraits: { colors: ["purple", "green", "tan"], shape: "pterosaur", category: "dinosaur", bodyStyle: "alas_completas" } },
    
    // Snorlax
    { id: 143, name: "Snorlax", types: ["normal"], height: "2.1 m", weight: "460.0 kg", ability: "Sebo",
      description: "Este Pokémon come casi 400 kg de comida al día. Después de comer, se duerme inmediatamente.",
      visualTraits: { colors: ["teal", "green", "cream"], shape: "biped_fat", category: "bear", bodyStyle: "bipedo_grande" } },
    
    // Articuno
    { id: 144, name: "Articuno", types: ["ice", "flying"], height: "1.7 m", weight: "55.4 kg", ability: "Presión",
      description: "Un legendario pájaro de hielo. Su hermoso y transparente plumaje parece hielo.",
      visualTraits: { colors: ["blue", "white", "ice"], shape: "bird_legendary", category: "legendary", bodyStyle: "alas_completas" } },
    
    // Zapdos
    { id: 145, name: "Zapdos", types: ["electric", "flying"], height: "1.6 m", weight: "52.6 kg", ability: "Presión",
      description: "Un legendario pájaro eléctrico. Atrae relámpagos y gana energía de ellos.",
      visualTraits: { colors: ["yellow", "black", "orange"], shape: "bird_legendary_spiky", category: "legendary", bodyStyle: "alas_completas" } },
    
    // Moltres
    { id: 146, name: "Moltres", types: ["fire", "flying"], height: "2.0 m", weight: "60.0 kg", ability: "Presión",
      description: "Un legendario pájaro de fuego. Cada aleteo crea llamas brillantes.",
      visualTraits: { colors: ["orange", "red", "yellow"], shape: "bird_legendary_flame", category: "legendary", bodyStyle: "alas_completas" } },
    
    // Dratini line
    { id: 147, name: "Dratini", types: ["dragon"], height: "1.8 m", weight: "3.3 kg", ability: "Mudar",
      description: "Se cree que es la forma pura de un dragón. Es muy raro en la naturaleza.",
      visualTraits: { colors: ["blue", "white"], shape: "serpent", category: "dragon", bodyStyle: "serpiente" } },
    { id: 148, name: "Dragonair", types: ["dragon"], height: "4.0 m", weight: "16.5 kg", ability: "Mudar",
      description: "Tiene una esfera de energía cristalizada en el cuello. Puede cambiar el clima.",
      visualTraits: { colors: ["blue", "white", "pink"], shape: "serpent_elegant", category: "dragon", bodyStyle: "serpiente" } },
    { id: 149, name: "Dragonite", types: ["dragon", "flying"], height: "2.2 m", weight: "210.0 kg", ability: "Foco interno",
      description: "Este Pokémon bondadoso rescata a la gente perdida en el mar y guía barcos en tormentas.",
      visualTraits: { colors: ["orange", "green", "white"], shape: "dragon_winged", category: "dragon", bodyStyle: "bipedo_con_alas" } },
    
    // Mewtwo
    { id: 150, name: "Mewtwo", types: ["psychic"], height: "2.0 m", weight: "122.0 kg", ability: "Presión",
      description: "Fue creado mediante la manipulación genética. No se logró dotarle de corazón compasivo.",
      visualTraits: { colors: ["purple", "white", "gray"], shape: "humanoid_cat", category: "legendary", bodyStyle: "bipedo_colas" } },
    
    // Mew
    { id: 151, name: "Mew", types: ["psychic"], height: "0.4 m", weight: "4.0 kg", ability: "Sincronía",
      description: "Dicen que Mew posee el código genético de todos los Pokémon. Es muy raro.",
      visualTraits: { colors: ["pink", "white"], shape: "cat_floating", category: "legendary", bodyStyle: "bipedo_redondo" } }
];

// Mapeo de tipos a nombres en español
const TYPE_NAMES = {
    normal: "Normal", fire: "Fuego", water: "Agua", electric: "Eléctrico", grass: "Planta",
    ice: "Hielo", fighting: "Lucha", poison: "Veneno", ground: "Tierra", flying: "Volador",
    psychic: "Psíquico", bug: "Bicho", rock: "Roca", ghost: "Fantasma", dragon: "Dragón",
    dark: "Siniestro", steel: "Acero", fairy: "Hada"
};

// Funciones de búsqueda
function findPokemonByName(name) {
    return POKEMON_DATABASE.find(p => p.name.toLowerCase() === name.toLowerCase());
}

function findPokemonById(id) {
    return POKEMON_DATABASE.find(p => p.id === id);
}

function getPokemonByType(type) {
    if (type === 'all') return POKEMON_DATABASE;
    return POKEMON_DATABASE.filter(p => p.types.includes(type));
}

function getTypeName(type) {
    return TYPE_NAMES[type] || type;
}

// Exportar para uso en app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { POKEMON_DATABASE, TYPE_NAMES, findPokemonByName, findPokemonById, getPokemonByType, getTypeName };
}
