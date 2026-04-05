import { useState, useEffect } from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as tf from '@tensorflow/tfjs'

export const loadMobileNet = async () => {
  try {
    console.log('Cargando MobileNet...')
    const model = await mobilenet.load()
    console.log('✅ MobileNet cargado')
    return model
  } catch (error) {
    console.error('❌ Error cargando MobileNet:', error)
    return null
  }
}

export const loadPokemonModel = async () => {
  try {
    console.log('Cargando modelo Pokémon...')
    // Usar ruta relativa para que funcione en local y producción
    const modelUrl = '/pokemon-model/model.json'
    const model = await tf.loadLayersModel(modelUrl)
    console.log('✅ Modelo Pokémon cargado')
    return model
  } catch (error) {
    console.error('❌ Error cargando modelo:', error)
    return null
  }
}

export const useModelLoader = () => {
  const [status, setStatus] = useState({
    mobilenet: false,
    pokemon: false,
    message: 'Cargando...'
  })

  useEffect(() => {
    const loadModels = async () => {
      const mobilenetModel = await loadMobileNet()
      const pokemonModel = await loadPokemonModel()
      
      setStatus({
        mobilenet: !!mobilenetModel,
        pokemon: !!pokemonModel,
        message: pokemonModel ? 'Modelo CNN listo' : 'Usando MobileNet'
      })
    }
    
    loadModels()
  }, [])

  return status
}
