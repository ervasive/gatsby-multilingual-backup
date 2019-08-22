import { useContext } from 'react'
import { MultilingualContext } from './MultilingualContext'
import { MLContextProviderData } from './types'

export default (): MLContextProviderData => {
  return useContext(MultilingualContext)
}
