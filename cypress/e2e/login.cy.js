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

  it('should display error on invalid email', () => {
    cy.fixture('login').then((data) => {
      cy.get('input[name="email"]').type(data.invalidEmail.email); // replace with actual test email
      cy.get('input[name="password"]').type(data.invalidEmail.password); // replace with actual test password
      
      cy.intercept('POST', '**/ajax.php?action=login').as('loginRequest');

      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        cy.get('.alert-danger').should('contain.text', 'Username or password is incorrect');
      });
    });
  });

  it('should display error on invalid password', () => {
    cy.fixture('login').then((data) => {
      cy.get('input[name="email"]').type(data.invalidPassword.email); // replace with actual test email
      cy.get('input[name="password"]').type(data.invalidPassword.password); // replace with actual test password
      
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
      cy.get('input[name="email"]').type(data.invalidEmailFormat.email); // invalid format email (e.g., without @)
      cy.get('input[name="password"]').type(data.invalidEmailFormat.password); // replace with actual test password
      
      cy.get('button[type="submit"]').click();

      cy.get('.alert-danger.email-error').should('contain.text', 'Invalid email format');
    });
  });

    it('should validate empty field submission', () => {
    // Click the submit button to trigger native validation
    cy.get('button[type="submit"]').click();

    // Validate that the email input is invalid and shows the native validation message
    cy.get('#email').then(($input) => {
      expect($input[0].checkValidity()).to.be.false;
      expect($input[0].validationMessage).to.eq('Please fill out this field.');
    });
  });

});
