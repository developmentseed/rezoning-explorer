describe('Explore view', () => {
  // Set a desktop screen as default for all tests
  beforeEach(() => {
    cy.viewport('macbook-13');
    // clear local storage to simulate first visit
    cy.clearLocalStorage();
  });

  it('Test site tour', () => {
    cy.visit('/explore?areaId=BFA&resourceId=Wind');
    // URL is updated
    cy.url().should(
      'eq',
      'http://localhost:9000/explore?areaId=BFA&resourceId=Wind'
    );

    cy.get('#tour-next-btn').should('exist');
    cy.get('#tour-next-btn').click();

    // Tour should be step 2
    cy.get('#tour-progress').should(($prog) => {
      expect($prog).to.contain('2 / 4');
    });
  });
});
