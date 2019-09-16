describe(`Page path helpers`, () => {
  it(`getPath should return correct page path`, () => {
    cy.visit('/page-path-helpers')

    cy.get('#page-path-by-generic-path').contains('/en/all-languages-static')
    cy.get('#page-path-by-slug').contains('/en/all-languages-static')
  })

  it(`getLanguages should return all page languages`, () => {
    cy.visit('/page-path-helpers')

    cy.get('#page-language-en').contains('/en/all-languages-static')
    cy.get('#page-language-ru').contains('/ru/all-languages-static')
  })
})
