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
    const modelUrl = window.location.origin + '/pokemon-model/model.json'
    const weightsUrl = window.location.origin + '/pokemon-model/weights.bin'
    
    console.log('URLs:', { modelUrl, weightsUrl })
    
    // Verificar que los archivos existen primero (sin caché)
    const modelResponse = await fetch(modelUrl, { cache: 'no-store' })
    if (!modelResponse.ok) {
      throw new Error(`Modelo no encontrado: ${modelResponse.status}`)
    }
    console.log('✅ model.json accesible')
    
    const weightsResponse = await fetch(weightsUrl, { cache: 'no-store' })
    if (!weightsResponse.ok) {
      throw new Error(`Weights no encontrados: ${weightsResponse.status}`)
    }
    console.log('✅ weights.bin accesible')
    
    // Cargar el modelo usando HTTP IO handler sin caché
    const model = await tf.loadLayersModel(
      tf.io.http(modelUrl, {
        weightUrlConverter: async () => weightsUrl,
        fetchFunc: (url) => fetch(url, { cache: 'no-store' })
      })
    )
    
    console.log('✅ Modelo Pokémon cargado exitosamente')
    return model
  } catch (error) {
    console.error('❌ Error cargando modelo:', error.message)
    console.error('Stack:', error.stack)
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
