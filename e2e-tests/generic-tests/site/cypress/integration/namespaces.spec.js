describe('Namespaces', () => {
  it('should only register namespace nodes of supported media types and ignore other file nodes', () => {
    cy.visit('/')
    cy.get('#allFileCount').contains('16')
    cy.get('#allGatsbyMultilingualNamespaceCount').contains('13')
  })

  it('should set correct namespace, language and priority values', () => {
    cy.visit('/')

    // Theme registered nodes
    cy.get('#theme-priority-auto-language-en .namespace').contains('common')
    cy.get('#theme-priority-auto-language-en .language').contains('en')
    cy.get('#theme-priority-auto-language-en .priority').contains('0')

    cy.get('#theme-priority-auto-language-ru .namespace').contains('common')
    cy.get('#theme-priority-auto-language-ru .language').contains('ru')
    cy.get('#theme-priority-auto-language-ru .priority').contains('0')

    cy.get('#theme-priority-custom-language-en .namespace').contains('common')
    cy.get('#theme-priority-custom-language-en .language').contains('en')
    cy.get('#theme-priority-custom-language-en .priority').contains('10')

    cy.get('#theme-priority-custom-language-ru .namespace').contains('common')
    cy.get('#theme-priority-custom-language-ru .language').contains('ru')
    cy.get('#theme-priority-custom-language-ru .priority').contains('10')

    // Default gatsby-plugin-multilingual nodes
    cy.get('#gatsby-plugin-multilingual-language-en .namespace').contains(
      'common',
    )
    cy.get('#gatsby-plugin-multilingual-language-en .language').contains('en')
    cy.get('#gatsby-plugin-multilingual-language-en .priority').contains('1')

    cy.get('#gatsby-plugin-multilingual-language-ru .namespace').contains(
      'common',
    )
    cy.get('#gatsby-plugin-multilingual-language-ru .language').contains('ru')
    cy.get('#gatsby-plugin-multilingual-language-ru .priority').contains('1')

    // Site registered nodes
    cy.get('#site-priority-auto-one-language-en .namespace').contains('common')
    cy.get('#site-priority-auto-one-language-en .language').contains('en')
    cy.get('#site-priority-auto-one-language-en .priority').contains('2')

    cy.get('#site-priority-auto-one-language-ru .namespace').contains('common')
    cy.get('#site-priority-auto-one-language-ru .language').contains('ru')
    cy.get('#site-priority-auto-one-language-ru .priority').contains('2')

    cy.get('#site-priority-auto-two-language-en .namespace').contains('common')
    cy.get('#site-priority-auto-two-language-en .language').contains('en')
    cy.get('#site-priority-auto-two-language-en .priority').contains('3')

    cy.get('#site-priority-auto-two-language-ru .namespace').contains('common')
    cy.get('#site-priority-auto-two-language-ru .language').contains('ru')
    cy.get('#site-priority-auto-two-language-ru .priority').contains('3')

    cy.get('#site-priority-custom-language-en .namespace').contains('common')
    cy.get('#site-priority-custom-language-en .language').contains('en')
    cy.get('#site-priority-custom-language-en .priority').contains('5')

    cy.get('#site-priority-custom-language-ru .namespace').contains('common')
    cy.get('#site-priority-custom-language-ru .language').contains('ru')
    cy.get('#site-priority-custom-language-ru .priority').contains('5')

    cy.get('#yaml-namespace-node .namespace').contains('yaml-namespace')
    cy.get('#yaml-namespace-node .language').contains('en')
    cy.get('#yaml-namespace-node .priority').contains('5')
  })
})
