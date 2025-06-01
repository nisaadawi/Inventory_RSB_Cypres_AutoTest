// Test suite for the adding new ingredients functionality
describe('Add Ingredients Functionality Tests', () => {
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
  
        // Navigate to ingredients page
        cy.contains('Total Ingredients IN').click();
        cy.url().should('include', 'index.php?page=ingredients');
        
        // Go to add ingredient form
        cy.contains('Add Ingredient').click();
        cy.url().should('include', 'index.php?page=new_ingredients');
      });
    });
  
  
    it('should allow adding new ingredients', () => {
      
      cy.fixture('new_ingredients').then((data) => {
        const d = data.validInput;
  
        cy.get('select[name="category"]').select('Dry Ingredient');
        cy.get('input[name="ingredient_code"]').clear().type(d.code);
        cy.get('input[name="ingredient_name"]').type(d.name);
        cy.get('input[name="current_quantity"]').type(d.quantity);
        cy.get('input[name="measurement"]').type(d.measurement);
        cy.get('select[name="supplier_detail"]').select('SUPTEP001 - TEPUNG BINTANG SDN BHD');
        cy.get('input[name="date_in"]').type(d.datein);
        cy.get('input[name="expiration_date"]').type(d.expdate);
  
        cy.contains('Save').click()

        // Add assertion for success message
        cy.contains('Data successfully saved').should('be.visible');
  
        });
      });
    

      it('Should validate ingredient code format', () => {
        cy.fixture('new_ingredients').then((data) => {
          const d = data.invalidCode;
      
          // Fill out the form
          cy.get('select[name="category"]').select('Dry Ingredient');
          
          // Clear the ingredient code field without typing anything
          cy.get('input[name="ingredient_code"]').type(d.name);
          
          // Fill other required fields
          cy.get('input[name="ingredient_name"]').type(d.name);
          cy.get('input[name="current_quantity"]').type(d.quantity);
          cy.get('input[name="measurement"]').type(d.measurement);
          cy.get('select[name="supplier_detail"]').select('SUPTEP001 - TEPUNG BINTANG SDN BHD');
          cy.get('input[name="date_in"]').type(d.datein);
          cy.get('input[name="expiration_date"]').type(d.expdate);
      
          // Submit the form
          cy.contains('Save').click();

           // Add assertion for success message
        cy.contains('Ingredient code cannot contain spaces').should('be.visible');

         });
      });

      it('should validate quantity with invalid characters', () => {
      
      cy.fixture('new_ingredients').then((data) => {
        const d = data.invalidQuantity;

        cy.get('select[name="category"]').select('Dry Ingredient');
        cy.get('input[name="ingredient_code"]').clear().type(d.code);
        cy.get('input[name="ingredient_name"]').type(d.name);
        cy.get('input[name="current_quantity"]').type(d.quantity);
        cy.get('input[name="measurement"]').type(d.measurement);
        cy.get('select[name="supplier_detail"]').select('SUPTEP001 - TEPUNG BINTANG SDN BHD');
        cy.get('input[name="date_in"]').type(d.datein);
        cy.get('input[name="expiration_date"]').type(d.expdate);
  
        cy.contains('Save').click()
  
      });
    });
  
    it('should validate measurement with invalid characters', () => {
      
      cy.fixture('new_ingredients').then((data) => {
        const d = data.invalidMeasurement;
  
        cy.get('select[name="category"]').select('Dry Ingredient');
        cy.get('input[name="ingredient_code"]').clear().type(d.code);
        cy.get('input[name="ingredient_name"]').type(d.name);
        cy.get('input[name="current_quantity"]').type(d.quantity);
        cy.get('input[name="measurement"]').type(d.measurement);
        cy.get('select[name="supplier_detail"]').select('SUPTEP001 - TEPUNG BINTANG SDN BHD');
        cy.get('input[name="date_in"]').type(d.datein);
        cy.get('input[name="expiration_date"]').type(d.expdate);
  
        cy.contains('Save').click()
  
        // Verify the validation message using the browser's built-in validation
        cy.get('input[name="measurement"]').then(($input) => {
          expect($input[0].validationMessage).to.contain(
            "Please match the requested format."
          );
        });
      });
    });

    it('should validate date in with wrong date format', () => {
      
      cy.fixture('new_ingredients').then((data) => {
        const d = data.invalidMeasurement;
  
        cy.get('select[name="category"]').select('Dry Ingredient');
        cy.get('input[name="ingredient_code"]').clear().type(d.code);
        cy.get('input[name="ingredient_name"]').type(d.name);
        cy.get('input[name="current_quantity"]').type(d.quantity);
        cy.get('input[name="measurement"]').type(d.measurement);
        cy.get('select[name="supplier_detail"]').select('SUPTEP001 - TEPUNG BINTANG SDN BHD');
        cy.get('input[name="date_in"]').type(d.datein);
        cy.get('input[name="expiration_date"]').type(d.expdate);
  
        cy.contains('Save').click()
  
        // Verify the validation message using the browser's built-in validation
        cy.get('input[name="date_in"]').then(($input) => {
          expect($input[0].validationMessage).to.contain(
            "Invalid date format."
          );
        });
      });
    });

    it('should validate date in with wrong date format', () => {
      
      cy.fixture('new_ingredients').then((data) => {
        const d = data.invalidMeasurement;
  
        cy.get('select[name="category"]').select('Dry Ingredient');
        cy.get('input[name="ingredient_code"]').clear().type(d.code);
        cy.get('input[name="ingredient_name"]').type(d.name);
        cy.get('input[name="current_quantity"]').type(d.quantity);
        cy.get('input[name="measurement"]').type(d.measurement);
        cy.get('select[name="supplier_detail"]').select('SUPTEP001 - TEPUNG BINTANG SDN BHD');
        cy.get('input[name="date_in"]').type(d.datein);
        cy.get('input[name="expiration_date"]').type(d.expdate);
  
        cy.contains('Save').click()
  
        // Verify the validation message using the browser's built-in validation
        cy.get('input[name="expiration_date"]').then(($input) => {
          expect($input[0].validationMessage).to.contain(
            "Invalid date format."
          );
        });
      });
    });
     
    it('should validate empty field submission', () => {
    // Click the submit button to trigger native validation
    cy.get('button[type="submit"]').click();

    /// Verify the select field shows validation error
      cy.get('select[name="category"]').then(($select) => {
        expect($select[0].validationMessage).to.contain(
          'Please select an item in the list'
        );
      });
    });
  });