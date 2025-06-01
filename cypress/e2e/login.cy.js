describe('Login Functionality Tests', () => {
  const baseUrl = 'http://localhost/inventory_rsb'; // Change this to your actual URL

  beforeEach(() => {
    cy.visit(`${baseUrl}/login.php`);
  });

  it('should login successfully with valid credentials', () => {
    cy.fixture('login').then((data) => {
      cy.get('input[name="email"]').type(data.validUser.email); // replace with actual test email
      cy.get('input[name="password"]').type(data.validUser.password); // replace with actual test password

      cy.intercept('POST', '**/ajax.php?action=login').as('loginRequest');

      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        cy.url().should('include', 'index.php?page=home'); // successful redirect
      });
    });
  });

  it('should display error on invalid credentials', () => {
    cy.fixture('login').then((data) => {
      cy.get('input[name="email"]').type(data.invalidUser.email); // replace with actual test email
      cy.get('input[name="password"]').type(data.invalidUser.password); // replace with actual test password
      
      cy.intercept('POST', '**/ajax.php?action=login').as('loginRequest');

      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        cy.get('.alert-danger').should('contain.text', 'Username or password is incorrect');
      });
    });
  });

  it('should validate email format before submission', () => {
    cy.fixture('login').then((data) => {
      cy.get('input[name="email"]').type(data.invalidFormat.email); // invalid format email (e.g., without @)
      cy.get('input[name="password"]').type(data.invalidFormat.password); // replace with actual test password
      
      cy.get('button[type="submit"]').click();

      cy.get('.alert-danger.email-error').should('contain.text', 'Invalid email format');
    });
  });
});
