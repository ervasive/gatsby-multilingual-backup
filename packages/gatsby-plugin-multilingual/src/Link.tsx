import React from 'react'
import { Link as GatsbyLinkComponent, GatsbyLinkProps } from 'gatsby'
import { useTranslation } from 'react-i18next'
import useMultilingual from './useMultilingual'

const Link = (
  { to, children, ...props }: GatsbyLinkProps<object>,
  ref: React.Ref<any>,
): JSX.Element => {
  const { i18n } = useTranslation()
  const { pages } = useMultilingual()
  let path: string

  if (pages[to] && pages[to][i18n.language]) {
    path = pages[to][i18n.language]
  } else {
    path = to
  }

  return (
    <GatsbyLinkComponent to={path} {...props} ref={ref}>
      {children}
    </GatsbyLinkComponent>
  )
}

export default React.forwardRef(Link)
