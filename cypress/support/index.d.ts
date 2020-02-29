// in cypress/support/index.d.ts
// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    loginCandidate(email: string, password: string): Chainable<Element>
    loginCompany(email: string, password: string): Chainable<Element>
    clearDraft(): Chainable<Element>
    resetDefaultPassword(): Chainable<Element>
  }
}