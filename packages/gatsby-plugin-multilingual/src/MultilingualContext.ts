import React from 'react'
import { ContextProviderData } from './types'
import getOptions from './get-options'

export const MultilingualContext = React.createContext<ContextProviderData>({
  ...getOptions(),
  pages: {},
})
