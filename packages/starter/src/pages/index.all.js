import React from "react"
import { Link } from "gatsby"
import { useMultilingual } from "gatsby-plugin-multilingual"

import Layout from "../components/layout"

const IndexPage = () => {
  const { getPath, currentLanguage } = useMultilingual()
    console.log(currentLanguage)
  return (
    <Layout>
      <h1>Hi people</h1>
      <p>Welcome to your new multilingual Gatsby site.</p>
      <p>Now go build something great.</p>
      {/* <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
      </div> */}
      <Link to={getPath("/page-2")}>Go to page 2</Link>
    </Layout>
  )
}

export default IndexPage
