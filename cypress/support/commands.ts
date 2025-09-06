/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      logout(): Chainable<void>;
      createProject(name: string, path: string): Chainable<void>;
      deleteProject(name: string): Chainable<void>;
      startChatSession(projectName: string): Chainable<void>;
      sendChatMessage(message: string): Chainable<void>;
    }
  }
}

// Custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('not.include', '/login');
  });
});

// Custom command for logout
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="user-menu"]').click();
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/login');
});

// Custom command for creating a project
Cypress.Commands.add('createProject', (name: string, path: string) => {
  cy.get('[data-testid="new-project-button"]').click();
  cy.get('[data-testid="project-name-input"]').type(name);
  cy.get('[data-testid="project-path-input"]').type(path);
  cy.get('[data-testid="create-project-button"]').click();
  cy.get('[data-testid="project-list"]').should('contain', name);
});

// Custom command for deleting a project
Cypress.Commands.add('deleteProject', (name: string) => {
  cy.get('[data-testid="project-list"]')
    .contains(name)
    .parent()
    .find('[data-testid="delete-project-button"]')
    .click();
  cy.get('[data-testid="confirm-delete-button"]').click();
  cy.get('[data-testid="project-list"]').should('not.contain', name);
});

// Custom command for starting a chat session
Cypress.Commands.add('startChatSession', (projectName: string) => {
  cy.get('[data-testid="project-list"]').contains(projectName).click();
  cy.get('[data-testid="new-session-button"]').click();
  cy.get('[data-testid="chat-interface"]').should('be.visible');
});

// Custom command for sending a chat message
Cypress.Commands.add('sendChatMessage', (message: string) => {
  cy.get('[data-testid="chat-input"]').type(message);
  cy.get('[data-testid="send-message-button"]').click();
  cy.get('[data-testid="chat-messages"]').should('contain', message);
});
