describe('Explore view', () => {
  // Set a desktop screen as default for all tests
  beforeEach(() => {
    cy.viewport('macbook-13');
  });

  it('Visit /explore, apply selections', () => {
    cy.visit('/explore');

    // Show select country modal, select a country
    cy.get('#select-country-modal-header').should('exist');
    cy.get('#country-BF-card').click();

    // URL is updated
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?countryId=BF&resource='
    );

    // Display "Select Resource" modal
    cy.get('#select-country-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('exist');

    // Click on Resource button
    cy.get('#resource-Wind-card').click();

    // URL is updated
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?countryId=BF&resource=Wind'
    );

    // Both modals are hidden
    cy.get('#select-country-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Prime panel contain selections
    cy.get('#selected-country-prime-panel-heading').should(
      'contain',
      'Burkina Faso'
    );
    cy.get('#selected-resource-prime-panel-heading').should('contain', 'Wind');

    // Hitting "Back" should update the URL
    cy.go('back');
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?countryId=BF&resource='
    );

    // And redisplay resource modal
    cy.get('#select-resource-modal-header').should('exist');

    // Hitting "Back" again should update the URL
    cy.go('back');
    cy.url().should('eq', 'http://localhost:9000/explore');

    // And redisplay resource modal
    cy.get('#select-country-modal-header').should('exist');
    cy.get('#select-resource-modal-header').should('not.exist');
  });

  it('Visit /explore?resource=Wind', () => {
    cy.visit('/explore?resource=Wind');

    // Show select country modal, select a country
    cy.get('#select-country-modal-header').should('exist');
    cy.get('#country-BF-card').click();

    // URL is updated
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?countryId=BF&resource=Wind'
    );

    // Hide all modals
    cy.get('#select-country-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Prime panel contains selections
    cy.get('#selected-country-prime-panel-heading').should(
      'contain',
      'Burkina Faso'
    );
    cy.get('#selected-resource-prime-panel-heading').should('contain', 'Wind');

    // Hitting "Back" should update the URL
    cy.go('back');
    cy.url().should('eq', 'http://localhost:9000/explore?resource=Wind');

    // And redisplay country modal
    cy.get('#select-country-modal-header').should('exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Hitting "Back" again should update the URL
    cy.get('#country-BF-card').click();

    // URL is updated
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?countryId=BF&resource=Wind'
    );

    // Display "Select Resource" modal
    cy.get('#select-country-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');
  });

  it('Visit /explore?countryId=BI', () => {
    cy.visit('/explore?countryId=BI');

    // Display "Select Resource" modal
    cy.get('#select-country-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('exist');

    // Click on Resource button
    cy.get('#resource-Wind-card').click();

    // URL is updated
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?countryId=BI&resource=Wind'
    );

    // Both modals are hidden
    cy.get('#select-country-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Prime panel contain selections
    cy.get('#selected-country-prime-panel-heading').should(
      'contain',
      'Burundi'
    );
    cy.get('#selected-resource-prime-panel-heading').should('contain', 'Wind');
  });

  it('Visit /explore?countryId=BI&resource=Wind', () => {
    cy.visit('/explore?countryId=BI&resource=Wind');

    // Both modals are hidden
    cy.get('#select-country-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Prime panel contain selections
    cy.get('#selected-country-prime-panel-heading').should(
      'contain',
      'Burundi'
    );
    cy.get('#selected-resource-prime-panel-heading').should('contain', 'Wind');

    // URL is kept
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?countryId=BI&resource=Wind'
    );
  });

  it('Select and change a country', () => {
    // Select country and resource first
    cy.visit('/explore');
    cy.get('#country-BF-card').click();
    cy.get('#resource-Wind-card').click();

    // Both modals are hidden
    cy.get('#select-country-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Reopen country modal and select
    cy.get('#select-country-button').click();

    // Country modal should open
    cy.get('#select-country-modal-header').should('exist');

    // Select another country
    cy.get('#country-BI-card').click();

    // Panel should be updated with country name
    cy.get('#selected-country-prime-panel-heading').should(
      'contain',
      'Burundi'
    );

    // And the URL should be updated too
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?countryId=BI&resource=Wind'
    );
  });
});
