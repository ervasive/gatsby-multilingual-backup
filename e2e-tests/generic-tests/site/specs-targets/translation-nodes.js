import React from 'react'

import { useStaticQuery, graphql } from 'gatsby'

const Page = () => {
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
    }
  `)

  return (
    <div>
      <h2>Test registered translation nodes count</h2>
      <p>Validate that non translation nodes are not registered as such.</p>
      <hr />
      <p>
        Registered all file nodes count:{' '}
        <span id="allFileCount">{data.allFile.nodes.length}</span>
      </p>
      <p>
        Registered translation namespace nodes count:{' '}
        <span id="allGatsbyMultilingualNamespaceCount">
          {data.allGatsbyMultilingualNamespace.nodes.length}
        </span>
      </p>

      <h2>Test registered translation nodes data</h2>
      <p>
        Validate that all registered translation nodes have appropriate data.
      </p>
      <table id="namespace-nodes" style={{ textAlign: 'left' }}>
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
    </div>
  )
}

export default Page
