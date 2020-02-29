/// <reference path="../../support/index.d.ts" />
/// <reference types="Cypress" />

import { Chance } from 'chance';
const chance = Chance();

describe('Company user saves message as a draft', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('company_url'));
    cy.clearDraft();
  });

  it('The messages will be saved as draft status', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('GET', '**/v1/companies/**').as('company');
    cy.route('GET', '**/v1/users/candidate-profiles**').as('candidate');
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
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.wait('@candidate', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@candidate', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
    cy.wait('@botRoom', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    const randomMessage = chance.guid();
    cy.get("textarea[class^='MessageInput-module_message']").type(randomMessage);
    cy.get("a[class*='ChannelMenu-module_menuItem']>span[class^='ChannelMenu-module_name']")
      .contains('Notes (me)')
      .click();
    cy.wait('@botRoom', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@roomPost', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@company', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("div[class^='ChannelMenu-module_titleContent']")
      .contains('Drafts')
      .parent()
      .siblings("ul[class^='ChannelMenu-module_list']")
      .get("span[class^='ChannelMenu-module_name']")
      .contains(Cypress.env('candidate_user_name'))
      .should('be.exist');
    cy.get("div[class^='ChannelMenu-module_titleContent']")
      .contains('Drafts')
      .parent()
      .siblings("ul[class^='ChannelMenu-module_list']")
      .get("span[class^='ChannelMenu-module_name']")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("textarea[class^='MessageInput-module_message']").should('contain.text', randomMessage);
    cy.get("textarea[class^='MessageInput-module_message']").clear();
    cy.get("a[class*='ChannelMenu-module_menuItem']>span[class^='ChannelMenu-module_name']")
      .contains('Notes (me)')
      .click();
    cy.wait('@roomPost', { timeout: 15000 })
      .its('status')
      .should('equal', 201);
    cy.get("a[class*='ChannelMenu-module_menuItem']>span[class^='ChannelMenu-module_name']")
      .contains(Cypress.env('candidate_user_name') + ' (candidate)')
      .should('be.visible');
  });

  it('Draft message for a thread', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('GET', '**/v1/threads/**').as('thread');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('GET', '**/v1/users/candidate-profiles**').as('candidate');
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
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.wait('@candidate', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@candidate', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
    cy.wait('@roomPost', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@botRoom', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    const randomMessage = chance.guid();
    cy.get("textarea[class^='MessageInput-module_message']").type(randomMessage);
    cy.get("textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.contains(randomMessage).click();
    cy.get("svg[data-icon='comment-lines']").click();
    cy.wait('@thread', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    const draftMessage = chance.guid();
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type(draftMessage);
    cy.get("div[class*='Replies_header'] svg[data-icon='times']").click();
    cy.wait('@roomPost', { timeout: 15000 })
      .its('status')
      .should('equal', 201);
    cy.contains(randomMessage).click();
    cy.get("svg[data-icon='comment-lines']").click();
    cy.wait('@thread', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").should(
      'contain.text',
      draftMessage,
    );
  });

  it('Draft message for multiple threads', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('GET', '**/v1/threads/**').as('thread');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('GET', '**/v1/users/candidate-profiles**').as('candidate');
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
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.wait('@candidate', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@candidate', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
    cy.wait('@roomPost', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@botRoom', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    const randomMessage = chance.guid();
    cy.get("textarea[class^='MessageInput-module_message']").type(randomMessage);
    cy.get("textarea[class^='MessageInput-module_message']").type('{enter}');
    const secondRandomMessage = chance.guid();
    cy.get("textarea[class^='MessageInput-module_message']").type(secondRandomMessage);
    cy.get("textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.contains(randomMessage).click();
    cy.get("svg[data-icon='comment-lines']").click();
    cy.wait('@thread', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    const draftMessage = chance.guid();
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type(draftMessage);
    cy.get("div[class*='Replies_header'] svg[data-icon='times']").click();
    cy.wait('@roomPost', { timeout: 15000 })
      .its('status')
      .should('equal', 201);
    cy.contains(secondRandomMessage).click();
    cy.get("svg[data-icon='comment-lines']").click();
    cy.wait('@thread', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").should('contain.text', '');
    cy.get("div[class*='Replies_header'] svg[data-icon='times']").click();
    cy.contains(randomMessage).click();
    cy.get("svg[data-icon='comment-lines']").click();
    cy.wait('@thread', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").should(
      'contain.text',
      draftMessage,
    );
  });

  it('Draft message for a thread after logout and login', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('GET', '**/v1/threads/**').as('thread');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('GET', '**/v1/users/candidate-profiles**').as('candidate');
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
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.wait('@candidate', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@candidate', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
    cy.wait('@roomPost', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@botRoom', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    const randomMessage = chance.guid();
    cy.get("textarea[class^='MessageInput-module_message']").type(randomMessage);
    cy.get("textarea[class^='MessageInput-module_message']").type('{enter}');
    cy.contains(randomMessage).click();
    cy.get("svg[data-icon='comment-lines']").click();
    cy.wait('@thread', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    const draftMessage = chance.guid();
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").type(draftMessage);
    cy.get("div[class*='Replies_header'] svg[data-icon='times']").click();
    cy.wait('@roomPost', { timeout: 15000 })
      .its('status')
      .should('equal', 201);
    cy.get('.ant-avatar>.anticon-user').click();
    cy.get('li.ant-dropdown-menu-item')
      .contains('Logout')
      .click();
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
    cy.get("a[class*='ChannelMenu-module_menuItem']>span[class^='ChannelMenu-module_name']")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.wait('@botRoom', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.contains(randomMessage).click();
    cy.get("svg[data-icon='comment-lines']").click();
    cy.wait('@thread', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("div[class*='Replies_footer'] textarea[class^='MessageInput-module_message']").should(
      'contain.text',
      draftMessage,
    );
  });
});
