import React from 'react'
import { MLContextProviderData } from './types'
import getOptions from './get-options'

export const MultilingualContext = React.createContext<MLContextProviderData>({
  ...getOptions(),
  pages: {},
})
