describe('Explore view', () => {
  // Set a desktop screen as default for all tests
  beforeEach(() => {
    cy.viewport('macbook-13');
  });

  it('Visit /explore, apply selections', () => {
    cy.visit('/explore');

    // Show select area modal, select a country
    cy.get('#select-area-modal-header').should('exist');
    cy.get('#area-BFA-card').click();

    // URL is updated
    cy.url().should(
      'contain',
      'areaId=BFA'
    );

    // Display "Select Resource" modal
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('exist');

    // Click on Resource button
    cy.get('#resource-Wind-card').click();

    // URL is updated
    cy.url().should(
      'contain',
      'areaId=BFA',
      'resourceId=Wind'
    );

    // Both modals are hidden
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Prime panel contain selections
    cy.get('#selected-area-prime-panel-heading').should(
      'contain',
      'Burkina Faso'
    );
    cy.get('#selected-resource-prime-panel-heading').should('contain', 'Wind');

    /*
     * TODO this is commented out due to the 'back' testing strategy producing errors
     * Changing the seelcted country performs 2 async updates to the url so going 'back'
     * has non deterministic results.
    // Hitting "Back" should update the URL
    cy.go('back');
    cy.url().should(
      'contain',
      'areaId=BFA'
    );

    // And redisplay resource modal
    cy.get('#select-resource-modal-header').should('exist');

    // Hitting "Back" again should update the URL
    cy.go('back');
    cy.url().should('not.contain', 'areaId=BFA');

    // And redisplay resource modal
    cy.get('#select-area-modal-header').should('exist');
    cy.get('#select-resource-modal-header').should('not.exist');
    */
  });

  it('Visit /explore?resourceId=Wind', () => {
    cy.visit('/explore?resourceId=Wind');

    // Show select area modal, select a country
    cy.get('#select-area-modal-header').should('exist');
    cy.get('#area-BFA-card').click();

    // URL is updated
    cy.url().should(
      'contain',
      'areaId=BFA',
      'resourceId=Wind'
    );

    // Hide all modals
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Prime panel contains selections
    cy.get('#selected-area-prime-panel-heading').should(
      'contain',
      'Burkina Faso'
    );
    cy.get('#selected-resource-prime-panel-heading').should('contain', 'Wind');

    /*
    // Hitting "Back" should update the URL
    cy.go('back');
    cy.url().should('contain', 'resourceId=Wind').and().should('not.contain', 'areaId=BFA');

    // And redisplay area modal
    cy.get('#select-area-modal-header').should('exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Hitting "Back" again should update the URL
    cy.get('#area-BFA-card').click();

    // URL is updated
    cy.url().should(
      'contain',
      'areaId=BFA',
      'resourceId=Wind'
    );

    // Display "Select Resource" modal
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');
    */
  });

  it('Visit /explore?areaId=BDI', () => {
    cy.visit('/explore?areaId=BDI');

    // Display "Select Resource" modal
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('exist');

    // Click on Resource button
    cy.get('#resource-Wind-card').click();

    // URL is updated
    cy.url().should(
      'contain',
      'areaId=BDI',
      'resourceId=Wind'
    );
    /*

    // Both modals are hidden
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Prime panel contain selections
    cy.get('#selected-area-prime-panel-heading').should(
      'contain',
      'Burundi'
    );
    cy.get('#selected-resource-prime-panel-heading').should('contain', 'Wind');*/
  });

  it('Visit /explore?areaId=BDI&resourceId=Wind', () => {
    cy.visit('/explore?areaId=BDI&resourceId=Wind');

    // Both modals are hidden
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Prime panel contain selections
    cy.get('#selected-area-prime-panel-heading').should(
      'contain',
      'Burundi'
    );
    cy.get('#selected-resource-prime-panel-heading').should('contain', 'Wind');

    // URL is kept
    cy.url().should(
      'contain',
      'areaId=BDI', 'resourceId=Wind'
    );
  });

  it('Select and change area', () => {
    // Select country and resource first
    cy.visit('/explore');
    cy.get('#area-BFA-card').click();
    cy.get('#resource-Wind-card').click();

    // Both modals are hidden
    cy.get('#select-area-modal-header').should('not.exist');
    cy.get('#select-resource-modal-header').should('not.exist');

    // Reopen country modal and select
    cy.get('#select-area-button').click();

    // Country modal should open
    cy.get('#select-area-modal-header').should('exist');

    // Select another country
    cy.get('#area-BDI-card').click();

    // Panel should be updated with country name
    cy.get('#selected-area-prime-panel-heading').should(
      'contain',
      'Burundi'
    );

    // And the URL should be updated too
    cy.url().should(
      'contain',
      'areaId=BDI', 'resourceId=Wind'
    );
  });
});
