describe("Checkout flow", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
     cy.visit('/')
    cy.get('[data-testid="input-email"]', { timeout: 10000 }).should('be.visible')
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

    cy.visit("/");
    cy.get('[data-testid="input-email"]').type("user@email.com");
    cy.get('[data-testid="input-password"]').type("123456");
    cy.get('[data-testid="btn-login"]').click();
    cy.wait("@getProducts");
    cy.url().should("include", "/products");
    cy.get('[data-testid="btn-add-to-cart"]').first().click();
    cy.get('[data-testid="btn-cart"]').click();
    cy.get('[data-testid="btn-checkout"]').click();
  });

  it("confirms order and navigates back to products", () => {
    cy.get('[data-testid="input-name"]').type("Usuario Teste");
    cy.get('[data-testid="input-address"]').type("Rua Central, 100");
    cy.get('[data-testid="input-city"]').type("Sao Paulo");
    cy.get('[data-testid="input-zip"]').type("01001000");
    cy.get('[data-testid="btn-payment-pix"]').click();

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
      cy.get('[data-testid="btn-confirm-order"]').click();
    });

    cy.get("@alert").should(
      "have.been.calledWith",
      "✅ Pedido realizado com sucesso!",
    );
    cy.url().should("include", "/products");
  });

  it.skip("shows error feedback when API is unavailable during order creation", () => {
    cy.intercept("POST", "http://localhost:3001/orders", {
      forceNetworkError: true,
    }).as("createOrder");
    cy.get('[data-testid="input-name"]').type("Usuario Teste");
    cy.get('[data-testid="input-address"]').type("Rua Central, 100");
    cy.get('[data-testid="input-city"]').type("Sao Paulo");
    cy.get('[data-testid="input-zip"]').type("01001000");
    cy.get('[data-testid="btn-payment-pix"]').click();

    cy.window().then((win) => {
      cy.stub(win, "alert").as("alert");
    });

    cy.get('[data-testid="btn-confirm-order"]').click();
    cy.wait("@createOrder");
    cy.get("@alert").should(
      "have.been.calledWith",
      "Erro ao confirmar pedido. Verifique se a API está ativa.",
    );
    cy.url().should("include", "/checkout");
  });
});
