describe('Global Test', function () {
    it('Checks if the application is working', function () {
        cy.server();
        cy.route("GET", "/CliniSys/api/configerps").as("getData");

        cy.visit('');

        cy.get('#listModules').should('exist');

        cy.wait("@getData").then(function (xhr) {
            expect(xhr.response.body.length).to.be.greaterThan(0);
        }).its('status').should('eq', 200);
    })
});
