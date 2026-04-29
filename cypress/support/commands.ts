Cypress.Commands.add('loginAsDefaultUser', () => {
  cy.intercept('GET', 'http://localhost:3001/users', { fixture: 'users.json' }).as('getUsers')
  cy.intercept('GET', 'http://localhost:3001/products', { fixture: 'products.json' }).as('getProducts')

  cy.visit('/')
  cy.get('[data-testid="input-email"]').type('user@email.com')
  cy.get('[data-testid="input-password"]').type('123456')
  cy.get('[data-testid="btn-login"]').click()

  cy.wait('@getUsers')
  cy.wait('@getProducts')
})

declare global {
  namespace Cypress {
    interface Chainable {
      loginAsDefaultUser(): Chainable<void>
    }
  }
}

export {}
