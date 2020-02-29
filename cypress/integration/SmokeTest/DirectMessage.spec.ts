/// <reference path="../../support/index.d.ts" />
/// <reference types="Cypress" />

describe('Company Direct Message', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('company_url'));
  });

  it('Direct message to multiple company users', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/rooms**').as('room');
    cy.route('POST', '**/v1/rooms/**').as('roomHide');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("span[class*='DirectMessageMenu_addIcon']")
      .eq(0)
      .click();
    cy.get("div[role='tab']")
      .contains('Company Users')
      .click();
    var roomName = '';
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div")
      .within(() => {
        cy.get('h5')
          .eq(0)
          .then((ele) => {
            roomName = ele.text() + ', ';
            ele.click();
          });
        cy.get('h5')
          .eq(1)
          .then((ele) => {
            roomName += ele.text() + ', ';
            ele.click();
          });
        cy.get('h5')
          .eq(2)
          .then((ele) => {
            roomName += ele.text() + ', ';
            ele.click();
          });
        cy.get('h5')
          .eq(3)
          .then((ele) => {
            roomName += ele.text() + ', ';
            ele.click();
          });
        cy.get('h5')
          .eq(4)
          .then((ele) => {
            roomName += ele.text();
            ele.click();
          });
      })
      .then(() => {
        cy.log(roomName);
        cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
        cy.wait('@roomHide', { timeout: 15000 })
          .its('status')
          .should('equal', 200);
        cy.get("a[class^='ChannelMenu-module_menuItem'].active").should('be.visible');
        cy.get("a[class^='ChannelMenu-module_menuItem'].active>span[class^='ChannelMenu-module_name']").should(
          'contain.text',
          roomName,
        );
        cy.get("a[class^='ChannelMenu-module_menuItem'].active").trigger('mouseover');
        cy.get('div.ant-tooltip')
          .not('.ant-tooltip-hidden')
          .find('.ant-tooltip-inner')
          .should('contain.text', roomName)
          .should('not.contain.text', Cypress.env('company_admin_name'));
      });
  });

  it('Direct message to multiple company users and single candidate', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('roomCreated');
    cy.route('POST', '**/v1/rooms/**').as('roomHide');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("span[class*='DirectMessageMenu_addIcon']")
      .eq(0)
      .click();
    cy.get("div[role='tab']")
      .contains('Company Users')
      .click();
    var roomName = '';
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div").within(() => {
      cy.get('h5')
        .eq(0)
        .then((ele) => {
          roomName = ele.text() + ', ';
          ele.click();
        });
      cy.get('h5')
        .eq(1)
        .then((ele) => {
          roomName += ele.text() + ', ';
          ele.click();
        });
      cy.get('h5')
        .eq(2)
        .then((ele) => {
          roomName += ele.text() + ', ';
          ele.click();
        });
      cy.get('h5')
        .eq(3)
        .then((ele) => {
          roomName += ele.text() + ', ';
          ele.click();
        });
      cy.get('h5')
        .eq(4)
        .then((ele) => {
          roomName += ele.text() + ', ';
          ele.click();
        });
    });
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div")
      .within(() => {
        cy.get('h5')
          .eq(0)
          .then((ele) => {
            ele.click();
          });
        cy.get('h5')
          .eq(1)
          .then((ele) => {
            roomName += ele.text();
            ele.click();
          });
      })
      .then(() => {
        cy.get('.ant-select-selection .ant-select-selection__choice').should('have.length', 6);
        cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
        cy.wait('@roomCreated', { timeout: 15000 })
          .its('status')
          .should('equal', 200);
        cy.wait('@roomHide', { timeout: 15000 })
          .its('status')
          .should('equal', 200);
        cy.get("a[class^='ChannelMenu-module_menuItem'].active>>span[class^='ChannelMenu-module_name']").should(
          'contain.text',
          roomName,
        );
      });
  });
});
