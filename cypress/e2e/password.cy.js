// To test password strength validation in every section that require password
// Can be used repeatedly for any password validation
describe("Password Strength Validation", () => {
  const baseUrl = "http://localhost/inventory_rsb";

  beforeEach(() => {
    // Ignore uncaught exceptions from cross-origin scripts
    Cypress.on("uncaught:exception", (err) => {
      // Returning false here prevents Cypress from failing the test
      if (
        err.message.includes("Script error") ||
        err.message.includes("cross origin")
      ) {
        return false;
      }
      return true;
    });

    cy.visit(`${baseUrl}/registration.php`);
  });

  it('should show "Weak" for passwords with less than 6 characters', () => {
    cy.fixture("password").then((data) => {
      const d = data.weakPassword;

      cy.get('input[name="password"]').clear().type(d.password);

      cy.get("#passwordStrength")
        .should("contain", d.expectedStrength)
        .and("have.css", "color", d.expectedColor);

      cy.get("#submitButton").should("be.disabled");
    });
  });

  it('should show "Medium" for passwords with less than 6 characters', () => {
    cy.fixture("password").then((data) => {
      const d = data.mediumPassword;

      cy.get('input[name="password"]').clear().type(d.password);

      cy.get("#passwordStrength")
        .should("contain", d.expectedStrength)
        .and("have.css", "color", d.expectedColor);

      cy.get("#submitButton").should("be.disabled");
    });
  });

  it('should show "Strong" for passwords with less than 6 characters', () => {
    cy.fixture("password").then((data) => {
      const d = data.strongPassword;

      cy.get('input[name="password"]').clear().type(d.password);

      cy.get("#passwordStrength")
        .should("contain", d.expectedStrength)
        .and("have.css", "color", d.expectedColor);

      cy.get("#submitButton");
    });
  });

  it("should show password requirements when info icon is clicked", () => {
    cy.get("#passwordRequirements").should("not.be.visible");
    cy.get("#passwordInfoIcon").click();
    cy.get("#passwordRequirements").should("be.visible");

    // Verify all requirements are listed
    cy.get("#passwordRequirements li").should("have.length", 5);
    cy.get("#passwordRequirements").should("contain", "At least 8 characters");
    cy.get("#passwordRequirements").should("contain", "1 uppercase letter");
    cy.get("#passwordRequirements").should("contain", "1 lowercase letter");
    cy.get("#passwordRequirements").should("contain", "1 number");
    cy.get("#passwordRequirements").should("contain", "1 special character");

    // Hide requirements
    cy.get("#passwordInfoIcon").click();
    cy.get("#passwordRequirements").should("not.be.visible");
  });

  it("should prevent submission with weak password", () => {
    cy.fixture("password").then((data) => {
    const d = data.preventWeakPass;
      cy.get('input[name="fullname"]').type(d.fullname);
      cy.get('input[name="contact"]').type(d.contact);
      cy.get('select[name="type"]').select("Inventory Supervisor");
      cy.get('input[name="email"]').type(d.email);
      cy.get('input[name="password"]').type(d.password);
      cy.get('input[name="confirmPassword"]').type(d.cpassword);
    });

    cy.get("form").submit();

    // Verify we're still on the registration page
    cy.url().should("include", "registration.php");

    // Verify the error message
    cy.get("#passwordStrength").should("contain", "Weak");
  });
});
