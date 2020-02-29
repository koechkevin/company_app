/// <reference types="Cypress" />
/// <reference path="../../support/index.d.ts" />

context('Company Access', () => {
    beforeEach(() => {
        cy.visit(Cypress.env('company_url'))
    })

    it('Users land on the signin page, and the cursor is set to the email address', () => {
        cy.focused().should('have.attr', 'id', 'username')
        cy.get("img[alt='Aurora Logo']").should('have.attr', 'src', '/images/icons/logo.svg')
        cy.get('.ant-typography').should('contain.text', 'Powered by')
            .find("img[alt='Aurora Logo']")
            .should('have.attr', 'src', '/images/icons/logo.svg')
    })

    it('Users are able to successfully signin', () => {
        cy.server()
        cy.route('GET', '**/v1/drafts').as('login')
        cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'))
        cy.wait('@login', { timeout: 15000 }).its('status').should('equal', 200)
        cy.get('.ant-avatar>.anticon-user').should('be.visible')
    })

    it('Users are able to successfully signout', () => {
        cy.server()
        cy.route('GET', '**/v1/drafts').as('login')
        cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'))
        cy.wait('@login', { timeout: 15000 }).its('status').should('equal', 200)
        cy.get('.ant-avatar>.anticon-user').click()
        cy.get('li.ant-dropdown-menu-item').contains('Logout').click()
        cy.get('.ant-avatar>.anticon-user').should('not.be.visible')
        cy.get('#username').should('be.visible')
    })

    it('Users are able to successfully signin again after signout', () => {
        cy.server()
        cy.route('GET', '**/v1/drafts').as('login')
        cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'))
        cy.wait('@login', { timeout: 15000 }).its('status').should('equal', 200)
        cy.get('.ant-avatar>.anticon-user').click()
        cy.get('li.ant-dropdown-menu-item').contains('Logout').click()
        cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'))
        cy.get('.ant-avatar>.anticon-user').should('be.visible')
    })

    it('Error displays when user enters invalid email adress', () => {
        cy.get('#username').type('invalid')
        cy.get('button.ant-btn-lg').click()
        cy.get('.ant-form-explain').should('contain.text', 'The email or password is invalid, please try again.')
    })

    it("If email/password combination is incorrect, the system will show an error message 'Email or password are invalid.", () => {
        cy.loginCompany('invalid@invalid.com', 'invalid')
        cy.get('button.ant-btn-lg').click({ force: true })
        cy.get('.ant-form-explain').should('contain.text', "We can’t find that user, please try again.")
    })

    it('Password field should work propery', () => {
        cy.get('#username').type(Cypress.env('company_admin'))
        cy.get('#password').type(Cypress.env('company_admin_password'))
        cy.get('#password').should('have.attr', 'type', 'password')
        cy.get('.ant-input-password-icon').click();
        cy.get('#password').should('have.attr', 'type', 'text')
    })
})
