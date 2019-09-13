import React from 'react'
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import createLink from '../create-link'

beforeEach(cleanup)

const pages = {
  '/page-one': {
    en: '/en/page-one-slug',
    ru: '/ru/путь-к-странице-один',
  },
}

describe('createLink', () => {
  const Link = createLink(pages, 'en', false)

  it(`should produce a result with a correct path`, () => {
    const { container } = render(
      <Link to="/page-one" language="en">
        Link
      </Link>,
    )
    expect(container.firstChild).toHaveAttribute('href', '/en/page-one-slug')
  })

  it(`should throw a specialized error on invalid value`, () => {
    expect(() =>
      render(
        <Link to="/path" language={1}>
          Link
        </Link>,
      ),
    ).toThrow(/the "Link" component returned an error/i)
  })
})
