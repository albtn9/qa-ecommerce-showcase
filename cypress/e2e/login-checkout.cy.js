import { shopPage } from '../pageObjects/ShopPage'

const checkoutData = {
  email: 'cliente@email.com',
  phone: '11999999999',
  firstName: 'Usuario',
  lastName: 'Teste',
  address: 'Rua Central, 100',
  city: 'Sao Paulo',
  state: 'SP',
  zip: '01001000',
}

describe('Login e checkout', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('deve autenticar e manter a sessao ao acessar a listagem de produtos', () => {
    // ARRANGE
    cy.loginAsDefaultUser()

    // ACT
    cy.visit('/products')

    // ASSERT
    cy.url().should('include', '/products')
    cy.get('[data-testid="product-card"]').should('have.length.at.least', 1)
    cy.get('[data-testid="btn-cart"]').should('contain', 'Carrinho (0)')
  })

  it('deve finalizar checkout via pix com sucesso', () => {
    // ARRANGE
    cy.loginAsDefaultUser()
    cy.intercept('POST', 'http://localhost:3001/orders', {
      statusCode: 201,
      body: { id: 999 },
    }).as('createOrder')

    // ACT
    shopPage.addFirstProductToCart()
    shopPage.openCart()
    shopPage.proceedToCheckout()
    shopPage.fillCheckoutContact(checkoutData)
    shopPage.fillCheckoutAddress(checkoutData)
    shopPage.selectPixPayment()
    shopPage.confirmOrder()

    // ASSERT
    cy.wait('@createOrder').its('response.statusCode').should('eq', 201)
    cy.url().should('include', '/products')
    cy.get('[data-testid="btn-cart"]').should('contain', 'Carrinho (0)')
  })
})
