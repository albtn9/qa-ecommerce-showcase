class ShopPage {
  visitLogin() {
    cy.visit('/')
  }

  fillLoginEmail(email) {
    cy.get('[data-testid="input-email"]').type(email)
  }

  fillLoginPassword(password) {
    cy.get('[data-testid="input-password"]').type(password)
  }

  submitLogin() {
    cy.get('[data-testid="btn-login"]').click()
  }

  addFirstProductToCart() {
    cy.get('[data-testid="btn-add-to-cart"]').first().click()
  }

  openCart() {
    cy.get('[data-testid="btn-cart"]').click()
  }

  proceedToCheckout() {
    cy.get('[data-testid="btn-checkout"]').click()
  }

  fillCheckoutContact({ email, phone }) {
    cy.get('[data-testid="input-email-checkout"]').type(email)
    cy.get('[data-testid="input-phone"]').type(phone)
  }

  fillCheckoutAddress({ firstName, lastName, address, city, state, zip }) {
    cy.get('[data-testid="input-name"]').type(firstName)
    cy.get('[data-testid="input-lastname"]').type(lastName)
    cy.get('[data-testid="input-address"]').type(address)
    cy.get('[data-testid="input-city"]').type(city)
    cy.get('[data-testid="input-state"]').type(state)
    cy.get('[data-testid="input-zip"]').type(zip)
  }

  selectPixPayment() {
    cy.get('[data-testid="btn-payment-pix"]').click()
  }

  confirmOrder() {
    cy.get('[data-testid="btn-confirm-order"]').click()
  }
}

export const shopPage = new ShopPage()
