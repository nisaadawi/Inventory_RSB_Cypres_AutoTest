// To test supplier functionality
describe('Login Functionality Tests', () => {
    const baseUrl = 'http://localhost/inventory_rsb'; // Change this to your actual URL
  
    before(() => {
      // Global error handler for canvas context errors
      Cypress.on('uncaught:exception', (err) => {
        if (err.message.includes("getContext")) {
          console.log('Suppressed canvas error:', err.message);
          return false; // Prevent test failure
        }
        return true;
      });
    });
  
    beforeEach(() => {
      cy.visit(`${baseUrl}/login.php`);
  
      cy.fixture('login').then((data) => {
        // Login
        cy.get('input[name="email"]').type(data.validUser.email);
        cy.get('input[name="password"]').type(data.validUser.password);
        
        cy.intercept('POST', '**/ajax.php?action=login').as('loginRequest');
        cy.get('button[type="submit"]').click();
        
        // Verify login
        cy.wait('@loginRequest').then((interception) => {
          expect(interception.response.statusCode).to.eq(200);
          cy.url().should('include', 'index.php?page=home');
        });
  
        // Navigate to supplier page
        cy.contains('Suppliers').click();
        cy.url().should('include', 'index.php?page=suppliers');
        
        // Go to add ingredient form
        cy.contains('Add Supplier').click();
        cy.url().should('include', 'index.php?page=supplier');
      });
    });
  
    it('Test valid characters', () => {
      
      cy.fixture('supplier').then((data) => {
        const d = data.validInput;
  
        cy.get('input[name="code"]').clear().type(d.code);
        cy.get('input[name="name"]').type(d.name);
        cy.get('input[name="contact"]').type(d.contact);
        cy.get('input[name="price"]').type(d.price);
        cy.get('input[name="ingredient"]').type(d.ingredient);
        cy.get('input[name="measurement"]').type(d.measurement);
        cy.get('select[name="performance"]').select('★');
  
        cy.contains('Save').click()
  
      });
    });

      it('should validate contact with invalid contact', () => {
      cy.fixture('supplier').then((data) => {
        const d = data.invalidContact;

        cy.get('input[name="code"]').clear().type(d.code);
        cy.get('input[name="name"]').type(d.name);
        cy.get('input[name="contact"]').type(d.contact);
        cy.get('input[name="price"]').type(d.price);
        cy.get('input[name="ingredient"]').type(d.ingredient);
        cy.get('input[name="measurement"]').type(d.measurement);
        cy.get('select[name="performance"]').select('★');

        cy.contains('Save').click();
        
         // Option 1: Check for alert dialog text (if it's a browser alert)
        cy.on('window:alert', (text) => {
          expect(text).to.include('Contact number must be numeric.');
        });
      });
    });

    it('should validate price with invalid price', () => {
      cy.fixture('supplier').then((data) => {
        const d = data.invalidContact;

        cy.get('input[name="code"]').clear().type(d.code);
        cy.get('input[name="name"]').type(d.name);
        cy.get('input[name="contact"]').type(d.contact);
        cy.get('input[name="price"]').type(d.price);
        cy.get('input[name="ingredient"]').type(d.ingredient);
        cy.get('input[name="measurement"]').type(d.measurement);
        cy.get('select[name="performance"]').select('★');

        cy.contains('Save').click();
        
        cy.on('window:alert', (text) => {
          expect(text).to.include('Price cannot be negative');
        });
      });
    });

    it('should validate measurement with invalid measurement', () => {
      cy.fixture('supplier').then((data) => {
        const d = data.invalireament
        cy.get('input[name="code"]').clear().type(d.code);
        cy.get('input[name="name"]').type(d.name);
        cy.get('input[name="contact"]').type(d.contact);
        cy.get('input[name="price"]').type(d.price);
        cy.get('input[name="ingredient"]').type(d.ingredient);
        cy.get('input[name="measurement"]').type(d.measurement);
        cy.get('select[name="performance"]').select('★');

        cy.contains('Save').click();
        
        cy.on('window:alert', (text) => {
          expect(text).to.include('invalid measurement format');
        });
      });
    });
 });