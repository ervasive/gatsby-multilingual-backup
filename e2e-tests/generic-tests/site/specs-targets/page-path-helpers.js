import React from 'react'

import { useMultilingual } from 'gatsby-plugin-multilingual'

const Index = () => {
  const { getPath, getLanguages } = useMultilingual()

  return (
    <div>
      <h2>Test page path related helpers</h2>
      <h2>getPath</h2>
      <p>
        Get existent page path by generic path value:{' '}
        <span id="page-path-by-generic-path">
          {getPath('/all-languages-static')}
        </span>
      </p>
      <p>
        Get existent page path by slug value:{' '}
        <span id="page-path-by-slug">
          {getPath('/ru/all-languages-static')}
        </span>
      </p>
      <h2>getLanguages</h2>
      <div>
        Get page languages by generic path value:{' '}
        <ul id="page-languages">
          {getLanguages('/all-languages-static').map(({ language, path }) => (
            <li key={language} id={`page-language-${language}`}>
              {path}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Index
