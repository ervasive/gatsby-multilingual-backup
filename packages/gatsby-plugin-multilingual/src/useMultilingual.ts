import { useContext } from 'react'
import { MultilingualContext } from './MultilingualContext'
import { ContextProviderData } from './types'

export default (): Partial<ContextProviderData> => {
  return useContext(MultilingualContext)
}
