describe('Multilingual pages', () => {
  it('should transform "static" pages into language specific pages', () => {
    cy.visit('/multilingual-pages')

    /* Check the "all" keyword */
    // pages/all-languages-static.all.js
    cy.get('[data-path="/en/all-languages-static"] .language').contains('en')
    cy.get('[data-path="/en/all-languages-static"] .generic-path').contains(
      '/all-languages-static',
    )

    cy.get('[data-path="/ru/all-languages-static"] .language').contains('ru')
    cy.get('[data-path="/ru/all-languages-static"] .generic-path').contains(
      '/all-languages-static',
    )

    cy.get('[data-path="/all-languages-static"]')
    cy.get('[data-path="/all-languages-static.all"]').should('not.exist')

    // pages/nested/all-languages-static.all.js
    cy.get('[data-path="/en/nested/all-languages-static"] .language').contains(
      'en',
    )
    cy.get(
      '[data-path="/en/nested/all-languages-static"] .generic-path',
    ).contains('/nested/all-languages-static')

    cy.get('[data-path="/ru/nested/all-languages-static"] .language').contains(
      'ru',
    )
    cy.get(
      '[data-path="/ru/nested/all-languages-static"] .generic-path',
    ).contains('/nested/all-languages-static')

    cy.get('[data-path="/nested/all-languages-static"]')
    cy.get('[data-path="/nested/all-languages-static.all"]').should('not.exist')

    /* Check comma separated language keys */
    // pages/multiple-languages-static.en,ru.js
    cy.get('[data-path="/en/multiple-languages-static"] .language').contains(
      'en',
    )
    cy.get(
      '[data-path="/en/multiple-languages-static"] .generic-path',
    ).contains('/multiple-languages-static')

    cy.get('[data-path="/ru/multiple-languages-static"] .language').contains(
      'ru',
    )
    cy.get(
      '[data-path="/ru/multiple-languages-static"] .generic-path',
    ).contains('/multiple-languages-static')

    cy.get('[data-path="/multiple-languages-static"]')
    cy.get('[data-path="/multiple-languages-static.en,ru"]').should('not.exist')

    // pages/nested/multiple-languages-static.en,ru.js
    cy.get(
      '[data-path="/en/nested/multiple-languages-static"] .language',
    ).contains('en')
    cy.get(
      '[data-path="/en/nested/multiple-languages-static"] .generic-path',
    ).contains('/nested/multiple-languages-static')

    cy.get(
      '[data-path="/ru/nested/multiple-languages-static"] .language',
    ).contains('ru')
    cy.get(
      '[data-path="/ru/nested/multiple-languages-static"] .generic-path',
    ).contains('/nested/multiple-languages-static')

    cy.get('[data-path="/nested/multiple-languages-static"]')
    cy.get('[data-path="/nested/multiple-languages-static.en,ru"]').should(
      'not.exist',
    )

    /* Check single language key */
    // pages/single-language-static.en.js
    cy.get('[data-path="/en/single-language-static"] .language').contains('en')
    cy.get('[data-path="/en/single-language-static"] .generic-path').contains(
      '/single-language-static',
    )

    cy.get('[data-path="/single-language-static"]')

    cy.get('[data-path="/ru/single-language-static"]').should('not.exist')
    cy.get('[data-path="/single-language-static.en"]').should('not.exist')

    // pages/nested/single-language-static.en.js
    cy.get(
      '[data-path="/en/nested/single-language-static"] .language',
    ).contains('en')
    cy.get(
      '[data-path="/en/nested/single-language-static"] .generic-path',
    ).contains('/nested/single-language-static')

    cy.get('[data-path="/nested/single-language-static"]')

    cy.get('[data-path="/ru/nested/single-language-static"]').should(
      'not.exist',
    )
    cy.get('[data-path="/nested/single-language-static.en"]').should(
      'not.exist',
    )

    /* Check that non-multilingual pages are ignored */
    // pages/no-language-static.js
    cy.get('[data-path="/no-languages-static"]').should('exist')
    cy.get('[data-path="/ru/no-languages-static"]').should('not.exist')
    cy.get('[data-path="/en/no-languages-static"]').should('not.exist')

    // pages/nested/no-language-static.js
    cy.get('[data-path="/nested/no-languages-static"]').should('exist')
    cy.get('[data-path="/ru/nested/no-languages-static"]').should('not.exist')
    cy.get('[data-path="/en/nested/no-languages-static"]').should('not.exist')

    /* Check that pages with non-registered language are ignored */
    // pages/not-allowed-language-static.de.js
    cy.get('[data-path="/not-allowed-language-static.de"]').should('exist')
    cy.get('[data-path="/ru/not-allowed-language-static"]').should('not.exist')
    cy.get('[data-path="/en/not-allowed-language-static"]').should('not.exist')
    cy.get('[data-path="/de/not-allowed-language-static"]').should('not.exist')

    // pages/nested/not-allowed-language-static.de.js
    cy.get('[data-path="/nested/not-allowed-language-static.de"]').should(
      'exist',
    )
    cy.get('[data-path="/ru/nested/not-allowed-language-static"]').should(
      'not.exist',
    )
    cy.get('[data-path="/en/nested/not-allowed-language-static"]').should(
      'not.exist',
    )
    cy.get('[data-path="/de/nested/not-allowed-language-static"]').should(
      'not.exist',
    )
  })

  it('should transform "dynamic" pages into language specific pages', () => {
    cy.visit('/multilingual-pages')

    /* Check the "all" keyword */
    // all-languages-dynamic
    cy.get('[data-path="/en/all-languages-dynamic"] .language').contains('en')
    cy.get('[data-path="/en/all-languages-dynamic"] .generic-path').contains(
      '/all-languages-dynamic',
    )

    cy.get('[data-path="/ru/all-languages-dynamic"] .language').contains('ru')
    cy.get('[data-path="/ru/all-languages-dynamic"] .generic-path').contains(
      '/all-languages-dynamic',
    )

    cy.get('[data-path="/all-languages-dynamic"]')

    // nested/all-languages-dynamic
    cy.get('[data-path="/en/nested/all-languages-dynamic"] .language').contains(
      'en',
    )
    cy.get(
      '[data-path="/en/nested/all-languages-dynamic"] .generic-path',
    ).contains('/nested/all-languages-dynamic')

    cy.get('[data-path="/ru/nested/all-languages-dynamic"] .language').contains(
      'ru',
    )
    cy.get(
      '[data-path="/ru/nested/all-languages-dynamic"] .generic-path',
    ).contains('/nested/all-languages-dynamic')

    cy.get('[data-path="/nested/all-languages-dynamic"]')

    /* Check comma separated language keys */
    // multiple-languages-dynamic
    cy.get('[data-path="/en/multiple-languages-dynamic"] .language').contains(
      'en',
    )
    cy.get(
      '[data-path="/en/multiple-languages-dynamic"] .generic-path',
    ).contains('/multiple-languages-dynamic')

    cy.get('[data-path="/ru/multiple-languages-dynamic"] .language').contains(
      'ru',
    )
    cy.get(
      '[data-path="/ru/multiple-languages-dynamic"] .generic-path',
    ).contains('/multiple-languages-dynamic')

    cy.get('[data-path="/multiple-languages-dynamic"]')

    // nested/multiple-languages-dynamic
    cy.get(
      '[data-path="/en/nested/multiple-languages-dynamic"] .language',
    ).contains('en')
    cy.get(
      '[data-path="/en/nested/multiple-languages-dynamic"] .generic-path',
    ).contains('/nested/multiple-languages-dynamic')

    cy.get(
      '[data-path="/ru/nested/multiple-languages-dynamic"] .language',
    ).contains('ru')
    cy.get(
      '[data-path="/ru/nested/multiple-languages-dynamic"] .generic-path',
    ).contains('/nested/multiple-languages-dynamic')

    cy.get('[data-path="/nested/multiple-languages-dynamic"]')

    /* Check single language key */
    // single-language-dynamic
    cy.get('[data-path="/en/single-language-dynamic"] .language').contains('en')
    cy.get('[data-path="/en/single-language-dynamic"] .generic-path').contains(
      '/single-language-dynamic',
    )

    cy.get('[data-path="/single-language-dynamic"]')

    cy.get('[data-path="/ru/single-language-dynamic"]').should('not.exist')

    // nested/single-language-dynamic
    cy.get(
      '[data-path="/en/nested/single-language-dynamic"] .language',
    ).contains('en')
    cy.get(
      '[data-path="/en/nested/single-language-dynamic"] .generic-path',
    ).contains('/nested/single-language-dynamic')

    cy.get('[data-path="/nested/single-language-dynamic"]')

    cy.get('[data-path="/ru/nested/single-language-dynamic"]').should(
      'not.exist',
    )

    /* Check that non-multilingual pages are ignored */
    // skipped-dynamic
    cy.get('[data-path="/skipped-dynamic"]').should('not.exist')
    cy.get('[data-path="/en/skipped-dynamic"]').should('not.exist')
    cy.get('[data-path="/ru/skipped-dynamic"]').should('not.exist')

    // nested/skipped-dynamic
    cy.get('[data-path="/nested/skipped-dynamic"]').should('not.exist')
    cy.get('[data-path="/en/nested/skipped-dynamic"]').should('not.exist')
    cy.get('[data-path="/ru/nested/skipped-dynamic"]').should('not.exist')

    // invalid-dynamic
    cy.get('[data-path="/invalid-dynamic"]').should('not.exist')
    cy.get('[data-path="/en/invalid-dynamic"]').should('not.exist')
    cy.get('[data-path="/ru/invalid-dynamic"]').should('not.exist')

    // nested/invalid-dynamic
    cy.get('[data-path="/nested/invalid-dynamic"]').should('not.exist')
    cy.get('[data-path="/en/nested/invalid-dynamic"]').should('not.exist')
    cy.get('[data-path="/ru/nested/invalid-dynamic"]').should('not.exist')

    /* Check that pages with non-registered language are ignored */
    // not-allowed-language-dynamic
    cy.get('[data-path="/not-allowed-language-dynamic"]').should('exist')
    cy.get('[data-path="/en/not-allowed-language-dynamic"]').should('not.exist')
    cy.get('[data-path="/ru/not-allowed-language-dynamic"]').should('not.exist')
    cy.get('[data-path="/de/not-allowed-language-dynamic"]').should('not.exist')

    // nested/not-allowed-language-dynamic
    cy.get('[data-path="/nested/not-allowed-language-dynamic"]').should('exist')
    cy.get('[data-path="/en/nested/not-allowed-language-dynamic"]').should(
      'not.exist',
    )
    cy.get('[data-path="/ru/nested/not-allowed-language-dynamic"]').should(
      'not.exist',
    )
    cy.get('[data-path="/de/nested/not-allowed-language-dynamic"]').should(
      'not.exist',
    )
  })
})
