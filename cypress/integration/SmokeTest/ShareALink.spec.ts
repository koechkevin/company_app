/// <reference path="../../support/index.d.ts" />
/// <reference types="Cypress" />

import { Chance } from 'chance';
const chance = Chance();

context('Company user share a link', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('company_url'));
  });

  it('Share link with example.com', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/users/candidate-profiles**').as('candidateProfiles');
    cy.route('GET', '**/v1/users/company-profiles**').as('companyProfiles');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('GET', '**/v1/companies/**').as('company');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("span[class*='DirectMessageMenu_addIcon']")
      .eq(0)
      .click();
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@companyProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
    const randomMessage = chance.guid();
    cy.get("textarea[class^='MessageInput-module_message']").type(randomMessage + ' example.com');
    cy.get("textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.contains(randomMessage)
      .find('a')
      .should('contain.text', 'example.com')
      .should('have.attr', 'target', '_blank');
  });

  it('Share link with www.example.com', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/users/candidate-profiles**').as('candidateProfiles');
    cy.route('GET', '**/v1/users/company-profiles**').as('companyProfiles');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('GET', '**/v1/companies/**').as('company');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("span[class*='DirectMessageMenu_addIcon']")
      .eq(0)
      .click();
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@companyProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
    const randomMessage = chance.guid();
    cy.get("textarea[class^='MessageInput-module_message']").type(randomMessage + ' www.example.com');
    cy.get("textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.contains(randomMessage)
      .find('a')
      .should('contain.text', 'www.example.com')
      .should('have.attr', 'target', '_blank');
  });

  it('Share link with http://example.com', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/users/candidate-profiles**').as('candidateProfiles');
    cy.route('GET', '**/v1/users/company-profiles**').as('companyProfiles');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('GET', '**/v1/companies/**').as('company');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("span[class*='DirectMessageMenu_addIcon']")
      .eq(0)
      .click();
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@companyProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
    const randomMessage = chance.guid();
    cy.get("textarea[class^='MessageInput-module_message']").type(randomMessage + ' http://example.com');
    cy.get("textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.contains(randomMessage)
      .find('a')
      .should('contain.text', 'http://example.com')
      .should('have.attr', 'target', '_blank');
  });

  it('Share link in thread with example.com', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/users/candidate-profiles**').as('candidateProfiles');
    cy.route('GET', '**/v1/users/company-profiles**').as('companyProfiles');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('GET', '**/v1/companies/**').as('company');
    cy.route('GET', '**/v1/threads/**').as('thread');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("span[class*='DirectMessageMenu_addIcon']")
      .eq(0)
      .click();
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@companyProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    const randomMessage = chance.guid();
    cy.get("textarea[class^='MessageInput-module_message']").type(randomMessage);
    cy.get("textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.contains(randomMessage).click();
    cy.get("svg[data-icon='comment-lines']").click();
    cy.wait('@thread', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    const threadMessage = chance.guid();
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type(
      threadMessage + ' example.com',
    );
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.contains(threadMessage)
      .find('a')
      .should('contain.text', 'example.com')
      .should('have.attr', 'target', '_blank');
  });

  it('Share link in thread with www.example.com', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/users/candidate-profiles**').as('candidateProfiles');
    cy.route('GET', '**/v1/users/company-profiles**').as('companyProfiles');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('GET', '**/v1/companies/**').as('company');
    cy.route('GET', '**/v1/threads/**').as('thread');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("span[class*='DirectMessageMenu_addIcon']")
      .eq(0)
      .click();
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@companyProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    const randomMessage = chance.guid();
    cy.get("textarea[class^='MessageInput-module_message']").type(randomMessage);
    cy.get("textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.contains(randomMessage).click();
    cy.get("svg[data-icon='comment-lines']").click();
    cy.wait('@thread', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    const threadMessage = chance.guid();
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type(
      threadMessage + ' www.example.com',
    );
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.contains(threadMessage)
      .find('a')
      .should('contain.text', 'www.example.com')
      .should('have.attr', 'target', '_blank');
  });

  it('Share link in thread with http://example.com', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/users/candidate-profiles**').as('candidateProfiles');
    cy.route('GET', '**/v1/users/company-profiles**').as('companyProfiles');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('GET', '**/v1/companies/**').as('company');
    cy.route('GET', '**/v1/threads/**').as('thread');
    cy.route('POST', '**/v1/messages/receipt').as('messagereceipt');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("span[class*='DirectMessageMenu_addIcon']")
      .eq(0)
      .click();
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@companyProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@candidateProfiles', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
    cy.wait('@botRoom', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@roomPost', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    const randomMessage = chance.guid();
    cy.get("textarea[class^='MessageInput-module_message']").type(randomMessage);
    cy.get("textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.wait('@messagereceipt', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.contains(randomMessage).click();
    cy.get("svg[data-icon='comment-lines']").click();
    cy.wait('@thread', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    const threadMessage = chance.guid();
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type(
      threadMessage + ' http://example.com',
    );
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.contains(threadMessage)
      .find('a')
      .should('contain.text', 'http://example.com')
      .should('have.attr', 'target', '_blank');
  });
});
