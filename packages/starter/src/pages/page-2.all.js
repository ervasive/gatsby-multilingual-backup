import React from "react"
import { Link } from "gatsby"
import { useMultilingual } from "gatsby-plugin-multilingual"

import Layout from "../components/layout"

const SecondPage = () => {
  const { getPath } = useMultilingual()

  return (
    <Layout>
      <h1>Hi from the second page</h1>
      <p>Welcome to page 2</p>
      <Link to={getPath("/")}>Go back to the homepage</Link>
    </Layout>
  )
}

export default SecondPage
