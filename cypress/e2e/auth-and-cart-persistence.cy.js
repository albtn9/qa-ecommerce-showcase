describe("Auth guard and cart persistence", () => {
  beforeEach(() => {
    cy.clearLocalStorage();

    cy.intercept("GET", "http://localhost:3001/products", {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Camiseta Preta",
          price: 59.9,
          originalPrice: 79.9,
          category: "roupas",
          stock: 10,
          inStock: true,
          image: "https://placehold.co/300x300",
          rating: 4.5,
          reviews: 128,
          description: "Camiseta básica",
          features: ["100% algodão"],
        },
      ],
    }).as("getProducts");
  });

  it("redirects protected routes to login when user is not authenticated", () => {
    cy.visit("/products");
    cy.url().should("include", "/");
  });

it('keeps cart items after page reload', () => {
  cy.visit('/')
  cy.get('[data-testid="input-email"]', { timeout: 10000 }).should('be.visible')
  cy.get('[data-testid="input-email"]').type('user@email.com')
  cy.get('[data-testid="input-password"]').type('123456')
  cy.get('[data-testid="btn-login"]').click()
  cy.wait('@getProducts')
  cy.url().should('include', '/products')
  cy.get('[data-testid="btn-add-to-cart"]').first().click()
  cy.get('[data-testid="btn-cart"]').should('contain', '(1)')
  cy.reload()
  cy.get('[data-testid="btn-cart"]').should('contain', '(1)')
})
});
