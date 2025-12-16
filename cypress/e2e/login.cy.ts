describe('Login básico', () => {
  it('Carga la página de login', () => {
    cy.visit('http://localhost:8100/login');
    cy.contains('Usuario').should('exist');
    cy.contains('Contraseña').should('exist');
  });
});
