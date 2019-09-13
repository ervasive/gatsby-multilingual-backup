import React, { useState, useEffect } from 'react'
import { Link as GatsbyLink, GatsbyLinkProps } from 'gatsby'
import getPagePath from './utils/get-page-path'
import { PagesRegistry } from './types'

// I'm not even going to try to type it manually
export default (
  pages: PagesRegistry,
  pageLanguage: string,
  globalStrict: boolean,
) => {
  const MultilingualLink = (
    {
      to,
      language,
      strict,
      ...props
    }: GatsbyLinkProps<unknown> & { language?: unknown; strict?: unknown },
    ref: React.Ref<any>,
  ): JSX.Element => {
    const [path, setPath] = useState<string>('/as')

    useEffect(() => {
      try {
        const result = getPagePath(
          { to, language, strict },
          { language: pageLanguage, strict: globalStrict },
          pages,
        )

        setPath(result as string)
      } catch (e) {
        throw new Error(`The "Link" component returned an error: ${e.message}`)
      }
    }, [to, language, strict])

    return <GatsbyLink to={path as string} {...props} ref={ref} />
  }

  return React.forwardRef(MultilingualLink)
}
