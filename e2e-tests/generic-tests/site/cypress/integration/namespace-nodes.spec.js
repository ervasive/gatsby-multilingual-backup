describe('Namespaces', () => {
  it('should validate that non translation nodes are not registered as such', () => {
    cy.visit('/translation-nodes')
    cy.get('#allFileCount').contains('14')
    cy.get('#allGatsbyMultilingualNamespaceCount').contains('11')
  })

  it('should validate that all registered translation nodes have appropriate data', () => {
    cy.visit('/translation-nodes')

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

    // Site registered nodes
    cy.get('#site-priority-auto-one-language-en .namespace').contains('common')
    cy.get('#site-priority-auto-one-language-en .language').contains('en')
    cy.get('#site-priority-auto-one-language-en .priority').contains('1')

    cy.get('#site-priority-auto-one-language-ru .namespace').contains('common')
    cy.get('#site-priority-auto-one-language-ru .language').contains('ru')
    cy.get('#site-priority-auto-one-language-ru .priority').contains('1')

    cy.get('#site-priority-auto-two-language-en .namespace').contains('common')
    cy.get('#site-priority-auto-two-language-en .language').contains('en')
    cy.get('#site-priority-auto-two-language-en .priority').contains('2')

    cy.get('#site-priority-auto-two-language-ru .namespace').contains('common')
    cy.get('#site-priority-auto-two-language-ru .language').contains('ru')
    cy.get('#site-priority-auto-two-language-ru .priority').contains('2')

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
