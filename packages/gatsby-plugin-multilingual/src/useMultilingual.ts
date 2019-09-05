import { useContext } from 'react'
import { MultilingualContext } from './MultilingualContext'
import { ContextProviderData } from './types'

export default (): ContextProviderData => {
  return useContext(MultilingualContext)
}
