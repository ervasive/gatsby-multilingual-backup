import React from "react"
import { Link, navigate } from "gatsby"
import { useMultilingual, useTranslation } from "gatsby-plugin-multilingual"

const Layout = ({ children }) => {
  const { getPath, getLanguages, currentLanguage } = useMultilingual()
  const { t } = useTranslation()

  return (
    <div>
      <p>{t("switchLanguage")}</p>
      <select onChange={e => navigate(e.target.value)}>
        {getLanguages({ skipCurrentLanguage: false }).map(
          ({ language, path }) => (
            <option
              key={language}
              value={path}
              selected={language === currentLanguage}
            >
              {language}
            </option>
          )
        )}
      </select>
      {children}
    </div>
  )
}

export default Layout
