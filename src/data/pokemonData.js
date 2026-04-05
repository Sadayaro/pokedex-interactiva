export const pokemonData = [
  { id: 1, name: 'Bulbasaur', type: 'Planta/Veneno', height: '0.7 m', weight: '6.9 kg', ability: 'Espesura', description: 'Un Pokémon raro que nace con una semilla en el lomo.' },
  { id: 2, name: 'Ivysaur', type: 'Planta/Veneno', height: '1.0 m', weight: '13.0 kg', ability: 'Espesura', description: 'Cuando la luz solar refuerza sus capacidades, el bulbo florece.' },
  { id: 3, name: 'Venusaur', type: 'Planta/Veneno', height: '2.0 m', weight: '100.0 kg', ability: 'Espesura', description: 'La flor florece absorbiendo la energía solar.' },
  { id: 4, name: 'Charmander', type: 'Fuego', height: '0.6 m', weight: '8.5 kg', ability: 'Mar de llamas', description: 'La llama de su cola indica su estado emocional.' },
  { id: 5, name: 'Charmeleon', type: 'Fuego', height: '1.1 m', weight: '19.0 kg', ability: 'Mar de llamas', description: 'Ataca con sus garras afiladas y su cola llameante.' },
  { id: 6, name: 'Charizard', type: 'Fuego/Volador', height: '1.7 m', weight: '90.5 kg', ability: 'Mar de llamas', description: 'Puede derretir cualquier material con su aliento de fuego.' },
  { id: 7, name: 'Squirtle', type: 'Agua', height: '0.5 m', weight: '9.0 kg', ability: 'Torrente', description: 'Se esconde en su caparazón y se defiende disparando agua.' },
  { id: 8, name: 'Wartortle', type: 'Agua', height: '1.0 m', weight: '22.5 kg', ability: 'Torrente', description: 'Su cola larga y peluda es un símbolo de longevidad.' },
  { id: 9, name: 'Blastoise', type: 'Agua', height: '1.6 m', weight: '85.5 kg', ability: 'Torrente', description: 'Dispara agua a alta presión por los cañones de su caparazón.' },
  { id: 25, name: 'Pikachu', type: 'Eléctrico', height: '0.4 m', weight: '6.0 kg', ability: 'Elec. Estática', description: 'Mantiene su cola en alto para vigilar los alrededores.' },
  { id: 26, name: 'Raichu', type: 'Eléctrico', height: '0.8 m', weight: '30.0 kg', ability: 'Elec. Estática', description: 'Puede descargar hasta 100,000 voltios.' },
  { id: 133, name: 'Eevee', type: 'Normal', height: '0.3 m', weight: '6.5 kg', ability: 'Fuga', description: 'Su ADN irregular le permite evolucionar de múltiples formas.' },
  { id: 143, name: 'Snorlax', type: 'Normal', height: '2.1 m', weight: '460.0 kg', ability: 'Sebo', description: 'Come hasta 400 kg de comida y luego duerme.' },
  { id: 150, name: 'Mewtwo', type: 'Psíquico', height: '2.0 m', weight: '122.0 kg', ability: 'Presión', description: 'Creado por manipulación genética, es un Pokémon de poder descomunal.' },
  { id: 151, name: 'Mew', type: 'Psíquico', height: '0.4 m', weight: '4.0 kg', ability: 'Sincronía', description: 'Se dice que contiene el código genético de todos los Pokémon.' }
]

export const getPokemonById = (id) => pokemonData.find(p => p.id === id)
export const getPokemonByType = (type) => pokemonData.filter(p => p.type.includes(type))
