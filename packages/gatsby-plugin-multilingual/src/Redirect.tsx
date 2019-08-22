import { navigate } from 'gatsby'
import { useTranslation } from 'react-i18next'
import useMultilingual from './useMultilingual'

const Redirect = ({ children }: { children: Function }): null | Error => {
  // temporary
  if (typeof window === 'undefined') {
    return null
  }

  const { i18n } = useTranslation()
  const { pages } = useMultilingual()

  const newNavigate = (to: string, options: object): void => {
    let path: string

    if (pages[to] && pages[to][i18n.language]) {
      path = pages[to][i18n.language]
    } else {
      path = to
    }

    // navigate(path, options)
  }

  if (typeof children !== 'function') {
    // TODO: add a link to docs.
    throw new Error('Redirect component "children" property must be a function')
  }

  children(newNavigate)
  return null
}

export default Redirect
