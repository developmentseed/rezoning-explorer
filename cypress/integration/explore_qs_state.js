describe('Explore view', () => {
  // Set a desktop screen as default for all tests
  beforeEach(() => {
    cy.viewport('macbook-13');
  });

  it.only('Visit /explore, apply selections', () => {
    cy.visit('/explore');

    // Show select country modal, select a country
    cy.get('#select-area-modal-header').should('exist');
    cy.get('#area-bf-card').click();

    // URL is updated
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?areaId=bf'
    );

    // Display "Select Resource" modal
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('exist');

    // Click on Resource button
    cy.get('#resource-Wind-card').click();

    // URL is updated
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?areaId=bf&resourceId=Wind'
    );

    // Both modals are hidden
    cy.get('#select-area-modal-header').should('not.exist');
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
      'http://localhost:9000/explore?areaId=bf'
    );

    // And redisplay resource modal
    cy.get('#select-resource-modal-header').should('exist');

    // Hitting "Back" again should update the URL
    cy.go('back');
    cy.url().should('eq', 'http://localhost:9000/explore');

    // And redisplay resource modal
    cy.get('#select-area-modal-header').should('exist');
    cy.get('#select-resource-modal-header').should('not.exist');
  });

  it('Visit /explore?resourceId=Wind', () => {
    cy.visit('/explore?resourceId=Wind');

    // Show select country modal, select a country
    cy.get('#select-area-modal-header').should('exist');
    cy.get('#country-BF-card').click();

    // URL is updated
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?areaId=bf&resourceId=Wind'
    );

    // Hide all modals
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Prime panel contains selections
    cy.get('#selected-country-prime-panel-heading').should(
      'contain',
      'Burkina Faso'
    );
    cy.get('#selected-resource-prime-panel-heading').should('contain', 'Wind');

    // Hitting "Back" should update the URL
    cy.go('back');
    cy.url().should('eq', 'http://localhost:9000/explore?resourceId=Wind');

    // And redisplay country modal
    cy.get('#select-area-modal-header').should('exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Hitting "Back" again should update the URL
    cy.get('#country-BF-card').click();

    // URL is updated
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?areaId=bf&resourceId=Wind'
    );

    // Display "Select Resource" modal
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');
  });

  it('Visit /explore?areaId=bi', () => {
    cy.visit('/explore?areaId=bi');

    // Display "Select Resource" modal
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('exist');

    // Click on Resource button
    cy.get('#resource-Wind-card').click();

    // URL is updated
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?areaId=bi&resourceId=Wind'
    );

    // Both modals are hidden
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Prime panel contain selections
    cy.get('#selected-country-prime-panel-heading').should(
      'contain',
      'Burundi'
    );
    cy.get('#selected-resource-prime-panel-heading').should('contain', 'Wind');
  });

  it('Visit /explore?areaId=bi&resourceId=Wind', () => {
    cy.visit('/explore?areaId=bi&resourceId=Wind');

    // Both modals are hidden
    cy.get('#select-area-modal-header').should('not.exist');
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
      'http://localhost:9000/explore?areaId=bi&resourceId=Wind'
    );
  });

  it('Select and change a country', () => {
    // Select country and resource first
    cy.visit('/explore');
    cy.get('#country-BF-card').click();
    cy.get('#resource-Wind-card').click();

    // Both modals are hidden
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Reopen country modal and select
    cy.get('#select-country-button').click();

    // Country modal should open
    cy.get('#select-area-modal-header').should('exist');

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
      'http://localhost:9000/explore?areaId=bi&resourceId=Wind'
    );
  });
});
