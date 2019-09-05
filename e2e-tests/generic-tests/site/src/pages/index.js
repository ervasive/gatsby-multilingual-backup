import React from 'react'

import { useStaticQuery, graphql } from 'gatsby'

const Index = () => {
  const data = useStaticQuery(graphql`
    query {
      allGatsbyMultilingualNamespace {
        nodes {
          namespace
          language
          priority
          data
        }
      }
      allFile {
        nodes {
          id
        }
      }
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
      <h2>Test registered nodes count</h2>
      <div>
        Registered file nodes count:{' '}
        <span id="allFileCount">{data.allFile.nodes.length}</span>
      </div>
      <div>
        Registered namespace nodes count:{' '}
        <span id="allGatsbyMultilingualNamespaceCount">
          {data.allGatsbyMultilingualNamespace.nodes.length}
        </span>
      </div>

      <h2>Test registered nodes data</h2>
      <table id="namespace-nodes">
        <thead>
          <tr>
            <th>Namespace</th>
            <th>Language</th>
            <th>Priority</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {data.allGatsbyMultilingualNamespace.nodes.map(
            ({ namespace, language, priority, data }) => {
              const nodeData = JSON.parse(data)

              return (
                <tr key={data} id={nodeData.key}>
                  <td className="namespace">{namespace}</td>
                  <td className="language">{language}</td>
                  <td className="priority">{priority}</td>
                  <td className="data">
                    <ul>
                      {Object.entries(nodeData).map(([key, value]) => (
                        <li key={key} id={key}>
                          {JSON.stringify(value)}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )
            },
          )}
        </tbody>
      </table>

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
          {data.allSitePage.nodes.map(
            ({ path, context: { language, genericPath } }) => {
              const dataPath = path.replace(/\/$/, '')
              return (
                <tr key={dataPath} data-path={dataPath}>
                  <td className="path">{path}</td>
                  <td className="language">{language}</td>
                  <td className="generic-path">{genericPath}</td>
                </tr>
              )
            },
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Index
