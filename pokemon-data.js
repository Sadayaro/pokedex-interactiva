// Base de datos de Pokémon con información completa en español
const POKEMON_DATABASE = [
    {
        id: 1,
        name: "Bulbasaur",
        types: ["grass", "poison"],
        height: "0.7 m",
        weight: "6.9 kg",
        ability: "Espesura",
        description: "Hay un bulboplanta en su espalda. Cuando absorbe los rayos solares, el bulboplanta va haciéndose cada vez más grande. Este Pokémon nace con una semilla en el lomo. Con el tiempo, la semilla brota y se convierte en una planta."
    },
    {
        id: 2,
        name: "Ivysaur",
        types: ["grass", "poison"],
        height: "1.0 m",
        weight: "13.0 kg",
        ability: "Espesura",
        description: "Este Pokémon lleva un bulbo en el lomo. Para poder aguantar el peso, tiene unas patas y un tronco gruesos y fuertes. Si empieza a pasar más tiempo al sol, será porque el bulbo está a punto de florecer."
    },
    {
        id: 3,
        name: "Venusaur",
        types: ["grass", "poison"],
        height: "2.0 m",
        weight: "100.0 kg",
        ability: "Espesura",
        description: "Según parece, la flor de Venusaur libera una suave fragancia que tiene un efecto relajante en el ánimo de las personas. En combate, este Pokémon da lo mejor de sí y no se arredra ante ningún enemigo."
    },
    {
        id: 4,
        name: "Charmander",
        types: ["fire"],
        height: "0.6 m",
        weight: "8.5 kg",
        ability: "Mar llamas",
        description: "La llama de la punta de la cola de Charmander es la medida de su vida. Si está débil, la llama arderá más tenue. Este Pokémon nace con una llama en la punta de la cola. Si se le apaga, fallece."
    },
    {
        id: 5,
        name: "Charmeleon",
        types: ["fire"],
        height: "1.1 m",
        weight: "19.0 kg",
        ability: "Mar llamas",
        description: "Charmeleon destroza a sus enemigos sin piedad con sus afiladas garras. Si se encuentra con un enemigo fuerte, se vuelve agresivo y la llama del final de su cola adquiere un intenso color blanco azulado."
    },
    {
        id: 6,
        name: "Charizard",
        types: ["fire", "flying"],
        height: "1.7 m",
        weight: "90.5 kg",
        ability: "Mar llamas",
        description: "Charizard se dedica a volar por los cielos en busca de oponentes fuertes. Echa fuego por la boca y es capaz de derretir cualquier cosa. No obstante, si su rival es más débil que él, no usará este ataque."
    },
    {
        id: 7,
        name: "Squirtle",
        types: ["water"],
        height: "0.5 m",
        weight: "9.0 kg",
        ability: "Torrente",
        description: "Cuando se siente en peligro, se esconde dentro de su caparazón y escupe chorros de agua. Cuando retracta su largo cuello en el caparazón, dispara agua a una presión increíble."
    },
    {
        id: 8,
        name: "Wartortle",
        types: ["water"],
        height: "1.0 m",
        weight: "22.5 kg",
        ability: "Torrente",
        description: "Tiene una cola larga y cubierta de un abundante pelaje que se vuelve más oscuro con la edad. Los arañazos que tiene en el caparazón dan fe de lo buen guerrero que es."
    },
    {
        id: 9,
        name: "Blastoise",
        types: ["water"],
        height: "1.6 m",
        weight: "85.5 kg",
        ability: "Torrente",
        description: "Blastoise tiene unos enormes cañones de agua que sobresalen de su caparazón. Los cañones pueden disparar agua con tanta fuerza que pueden agujerear el acero. Tiene una fuerza brutal."
    },
    {
        id: 10,
        name: "Caterpie",
        types: ["bug"],
        height: "0.3 m",
        weight: "2.9 kg",
        ability: "Polvo escudo",
        description: "Su característica más notable son sus patas cortas y rápidas. Si tocas los sensores de sus antenas, soltará un horrible olor para protegerse."
    },
    {
        id: 11,
        name: "Metapod",
        types: ["bug"],
        height: "0.7 m",
        weight: "9.9 kg",
        ability: "Mudar",
        description: "Está esperando el momento de evolucionar. Solo es capaz de endurecer su caparazón para protegerse. Se queda inmóvil en la rama de un árbol en espera de evolucionar."
    },
    {
        id: 12,
        name: "Butterfree",
        types: ["bug", "flying"],
        height: "1.1 m",
        weight: "32.0 kg",
        ability: "Ojo compuesto",
        description: "Adora el néctar de las flores. Puede localizar el polen más repleto de néctar, incluso si está a 10 km de distancia. Cuando llueve, se refugia bajo los árboles."
    },
    {
        id: 25,
        name: "Pikachu",
        types: ["electric"],
        height: "0.4 m",
        weight: "6.0 kg",
        ability: "Elec. estática",
        description: "Cuando se enfada, este Pokémon descarga la energía almacenada en las bolsas de sus mejillas. Este Pokémon tiene unas bolsas en las mejillas para almacenar electricidad."
    },
    {
        id: 26,
        name: "Raichu",
        types: ["electric"],
        height: "0.8 m",
        weight: "30.0 kg",
        ability: "Elec. estática",
        description: "Su cola descarga electricidad a tierra, protegiéndolo a sí mismo de los calambrazos. Este Pokémon puede almacenar hasta 100.000 voltios en su cuerpo."
    },
    {
        id: 39,
        name: "Jigglypuff",
        types: ["normal", "fairy"],
        height: "0.5 m",
        weight: "5.5 kg",
        ability: "Gran encanto",
        description: "Cuando este Pokémon canta, tiene un efecto hipnótico sobre quienes lo escuchan. Si se enfada, infla su cuerpo hasta duplicar su tamaño para intimidar."
    },
    {
        id: 52,
        name: "Meowth",
        types: ["normal"],
        height: "0.4 m",
        weight: "4.2 kg",
        ability: "Recogida",
        description: "Este Pokémon adora las cosas brillantes. De noche, se levanta y deambula, robando objetos que brillan. Tiene una moneda dorada en la frente."
    },
    {
        id: 54,
        name: "Psyduck",
        types: ["water"],
        height: "0.8 m",
        weight: "19.6 kg",
        ability: "Humedad",
        description: "Sufre constantemente de dolor de cabeza. Cuando éste se hace muy intenso, empieza a usar poderes psicoquinéticos misteriosos. No puede recordar haber usado dichos poderes."
    },
    {
        id: 58,
        name: "Growlithe",
        types: ["fire"],
        height: "0.7 m",
        weight: "19.0 kg",
        ability: "Intimidación",
        description: "Tiene una naturaleza valiente y fiel. Se pone furioso cuando le hacen enfadar, pero no olvida la bondad de quien le cuidó. Su pelaje es tan espectacular que se le compara con el sol."
    },
    {
        id: 59,
        name: "Arcanine",
        types: ["fire"],
        height: "1.9 m",
        weight: "155.0 kg",
        ability: "Intimidación",
        description: "Este Pokémon es legendario por su belleza. Corre tan rápido que muchos creen que está volando. Su majestuosa apariencia lo ha convertido en un símbolo de poder."
    },
    {
        id: 63,
        name: "Abra",
        types: ["psychic"],
        height: "0.9 m",
        weight: "19.5 kg",
        ability: "Sincronía",
        description: "Este Pokémon duerme 18 horas al día. Sin embargo, puede detectar cualquier peligro mientras duerme. Si siente peligro, se teletransporta lejos inmediatamente."
    },
    {
        id: 65,
        name: "Alakazam",
        types: ["psychic"],
        height: "1.5 m",
        weight: "48.0 kg",
        ability: "Sincronía",
        description: "Tiene un coeficiente intelectual de 5.000. La inteligencia crece continuamente, haciendo que su cabeza sea demasiado pesada para su cuello. Sostiene su cabeza con sus poderes psicoquinéticos."
    },
    {
        id: 94,
        name: "Gengar",
        types: ["ghost", "poison"],
        height: "1.5 m",
        weight: "40.5 kg",
        ability: "Levitar",
        description: "Para robarle la vida a su objetivo, se desliza en su sombra y espera en silencio. Si te sientes frío de repente, es que Gengar está cerca intentando maldicirte."
    },
    {
        id: 129,
        name: "Magikarp",
        types: ["water"],
        height: "0.9 m",
        weight: "10.0 kg",
        ability: "Nado rápido",
        description: "Este Pokémon es prácticamente inútil. Solo puede chapotear y hacer cara de sorpresa. Por eso, se considera el Pokémon más débil que existe. Sin embargo, puede saltar montañas."
    },
    {
        id: 130,
        name: "Gyarados",
        types: ["water", "flying"],
        height: "6.5 m",
        weight: "235.0 kg",
        ability: "Nado rápido",
        description: "Tiene una naturaleza muy agresiva. Se dice que la razón de esta agresividad se debe a que la estructura celular de su cuerpo sufrió un cambio brusco causado por la energía de la evolución."
    },
    {
        id: 131,
        name: "Lapras",
        types: ["water", "ice"],
        height: "2.5 m",
        weight: "220.0 kg",
        ability: "Absorbe agua",
        description: "Este Pokémon gentil transporta a la gente sobre su caparazón a través del mar. Es un excelente nadador que puede cruzar océanos enteros. Le encanta cantar."
    },
    {
        id: 133,
        name: "Eevee",
        types: ["normal"],
        height: "0.3 m",
        weight: "6.5 kg",
        ability: "Fuga",
        description: "Gracias a su inestable código genético, Eevee tiene el potencial de evolucionar en cualquier Pokémon. Es muy adaptable y puede vivir en cualquier entorno."
    },
    {
        id: 134,
        name: "Vaporeon",
        types: ["water"],
        height: "1.0 m",
        weight: "29.0 kg",
        ability: "Absorbe agua",
        description: "Vaporeon vive cerca del agua. Su cola se parece a la de una sirena. Puede controlar el agua a voluntad y desaparecer completamente en ella."
    },
    {
        id: 135,
        name: "Jolteon",
        types: ["electric"],
        height: "0.8 m",
        weight: "24.5 kg",
        ability: "Absorbe elec",
        description: "Las células de su cuerpo generan una corriente eléctrica de bajo nivel. Cuando está enfadado, esta corriente se intensifica y lanza rayos. Su pelaje erizado actúa como un detector de electricidad."
    },
    {
        id: 136,
        name: "Flareon",
        types: ["fire"],
        height: "0.9 m",
        weight: "25.0 kg",
        ability: "Absorbe fuego",
        description: "Este Pokémon almacena aire caliente en su pelaje y lo usa para regular su temperatura corporal. Puede alcanzar temperaturas de hasta 900 grados."
    },
    {
        id: 143,
        name: "Snorlax",
        types: ["normal"],
        height: "2.1 m",
        weight: "460.0 kg",
        ability: "Sebo",
        description: "Este Pokémon come casi 400 kg de comida al día. Después de comer, se duerme inmediatamente. Es tan fuerte que puede ganar cualquier lucha con solo usar Placaje."
    },
    {
        id: 149,
        name: "Dragonite",
        types: ["dragon", "flying"],
        height: "2.2 m",
        weight: "210.0 kg",
        ability: "Foco interno",
        description: "Este Pokémon bondadoso rescata a la gente perdida en el mar y guía barcos en tormentas. Es capaz de dar la vuelta al mundo en solo 16 horas."
    },
    {
        id: 150,
        name: "Mewtwo",
        types: ["psychic"],
        height: "2.0 m",
        weight: "122.0 kg",
        ability: "Presión",
        description: "Fue creado mediante la manipulación genética. Pero, aunque los genes científicos de Mewtwo le hicieron más fuerte, no se logró dotarle de corazón compasivo."
    },
    {
        id: 151,
        name: "Mew",
        types: ["psychic"],
        height: "0.4 m",
        weight: "4.0 kg",
        ability: "Sincronía",
        description: "Dicen que Mew posee el código genético de todos los Pokémon. Es muy raro y solo se ha visto por casualidad. Es capaz de hacerse invisible a voluntad."
    }
];

// Mapeo de tipos a nombres en español
const TYPE_NAMES = {
    normal: "Normal",
    fire: "Fuego",
    water: "Agua",
    electric: "Eléctrico",
    grass: "Planta",
    ice: "Hielo",
    fighting: "Lucha",
    poison: "Veneno",
    ground: "Tierra",
    flying: "Volador",
    psychic: "Psíquico",
    bug: "Bicho",
    rock: "Roca",
    ghost: "Fantasma",
    dragon: "Dragón",
    dark: "Siniestro",
    steel: "Acero",
    fairy: "Hada"
};

// Función para buscar Pokémon
function findPokemonByName(name) {
    return POKEMON_DATABASE.find(p => 
        p.name.toLowerCase() === name.toLowerCase()
    );
}

function findPokemonById(id) {
    return POKEMON_DATABASE.find(p => p.id === id);
}

function getPokemonByType(type) {
    if (type === 'all') return POKEMON_DATABASE;
    return POKEMON_DATABASE.filter(p => p.types.includes(type));
}

// Función para obtener nombre del tipo en español
function getTypeName(type) {
    return TYPE_NAMES[type] || type;
}
