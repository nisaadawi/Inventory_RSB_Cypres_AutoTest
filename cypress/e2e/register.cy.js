// To check for user registration functionality
describe('Registration Page Tests', () => {
  const baseUrl = 'http://localhost/inventory_rsb';

  beforeEach(() => {
    // Ignore uncaught exceptions from cross-origin scripts
    Cypress.on('uncaught:exception', (err) => {
      // Returning false here prevents Cypress from failing the test
      if (err.message.includes('Script error') || err.message.includes('cross origin')) {
        return false;
      }
      return true;
    });

    cy.visit(`${baseUrl}/registration.php`);
  });

  it('should validate full name with invalid characters', () => {
    cy.fixture('register').then((data) => {
      const d = data.invalidFullname;

      cy.get('input[name="fullname"]').clear().type(d.fullname);
      cy.get('input[name="contact"]').type(d.contact);
      cy.get('select[name="type"]').select('Inventory Supervisor');
      cy.get('input[name="email"]').type(d.email);
      cy.get('input[name="password"]').type(d.password);
      cy.get('input[name="confirmPassword"]').type(d.cpassword);

      cy.contains('Register').click()

      // Verify the validation message using the browser's built-in validation
      cy.get('input[name="fullname"]').then(($input) => {
        expect($input[0].validationMessage).to.contain(
          "Please match the requested format."
        );
      });
    });
  });

  it('should validate contact number with invalid characters', () => {
    cy.fixture('register').then((data) => {
      const d = data.invalidContact;

      cy.get('input[name="fullname"]').type(d.fullname);
      cy.get('input[name="contact"]').type(d.contact);
      cy.get('select[name="type"]').select('Inventory Supervisor');
      cy.get('input[name="email"]').type(d.email);
      cy.get('input[name="password"]').type(d.password);
      cy.get('input[name="confirmPassword"]').type(d.cpassword);

      cy.contains('Register').click()

      // Verify the validation message using the browser's built-in validation
      cy.get('input[name="contact"]').then(($input) => {
        expect($input[0].validationMessage).to.contain(
          "Please match the requested format."
        );
      });
    });
  });

  it('should select role', () => {
    cy.fixture('register').then((data) => {
      const d = data.invalidRole;

      cy.get('input[name="fullname"]').type(d.fullname);
      cy.get('input[name="contact"]').type(d.contact);
      cy.get('select[name="type"]').select('');
      cy.get('input[name="email"]').type(d.email);
      cy.get('input[name="password"]').type(d.password);
      cy.get('input[name="confirmPassword"]').type(d.cpassword);

      cy.contains('Register').click()

      // Verify the select field shows validation error
      cy.get('select[name="type"]').then(($select) => {
        expect($select[0].validationMessage).to.contain(
          'Please select an item in the list'
        );
      });
    });
  });

  it('should validate email format', () => {
    cy.fixture('register').then((data) => {
      const d = data.invalidEmail;

      cy.get('input[name="fullname"]').type(d.fullname);
      cy.get('input[name="contact"]').type(d.contact);
      cy.get('select[name="type"]').select('Inventory Supervisor');
      cy.get('input[name="email"]').type(d.email);
      cy.get('input[name="password"]').type(d.password);
      cy.get('input[name="confirmPassword"]').type(d.cpassword);

      cy.contains('Register').click()

      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Invalid email format. Please enter a valid email address.')
      })
    });
  });

  it('should validate password mismatch', () => {
    cy.fixture('register').then((data) => {
      const d = data.passMismatch;

      cy.get('input[name="fullname"]').type(d.fullname);
      cy.get('input[name="contact"]').type(d.contact);
      cy.get('select[name="type"]').select('Inventory Supervisor');
      cy.get('input[name="email"]').type(d.email);
      cy.get('input[name="password"]').type(d.password);
      cy.get('input[name="confirmPassword"]').type(d.cpassword);

      cy.contains('Register').click()
      
      cy.get("#submitButton").should("be.disabled");
    });
  });

  



});