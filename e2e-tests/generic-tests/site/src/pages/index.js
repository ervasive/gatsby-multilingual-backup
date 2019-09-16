import React from 'react'

import { useStaticQuery, graphql } from 'gatsby'

const Index = () => {
  const data = useStaticQuery(graphql`
    query {
      allSitePage {
        nodes {
          path
          context {
            language
            genericPath
          }
        }
      }
    }
  `)

  return (
    <div>
      <h2>Test registered lingual pages</h2>
      <table id="pages">
        <thead>
          <tr>
            <th>Path</th>
            <th>Language</th>
            <th>Generic path</th>
          </tr>
        </thead>
        <tbody>
          {data.allSitePage.nodes.map(node => {
            const dataPath = node.path.replace(/\/$/, '')
            const language = (node.context && node.context.language) || ''
            const genericPath = (node.context && node.context.genericPath) || ''

            return (
              <tr key={dataPath} data-path={dataPath}>
                <td className="path">{node.path}</td>
                <td className="language">{language}</td>
                <td className="generic-path">{genericPath}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Index
