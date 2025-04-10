describe('Prestation', function () {
    it('Checks if it render correctly', function () {
         cy.visit('');

        cy.get('#listModules > ul > li > a > ul > li').click({ force: true });

        cy.wait(10000);

        cy.get('table tbody tr.dx-data-row').its('length')
            .should('be.gt', 0)
    })
});