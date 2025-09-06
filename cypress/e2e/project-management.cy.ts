describe('Project Management', () => {
  beforeEach(() => {
    cy.visit('/');
    // Mock authentication for testing
    cy.window().then((win) => {
      win.localStorage.setItem('auth-token', 'mock-token');
    });
  });

  it('should display the main interface', () => {
    cy.get('[data-testid="main-layout"]').should('be.visible');
    cy.get('[data-testid="sidebar"]').should('be.visible');
    cy.get('[data-testid="content-area"]').should('be.visible');
  });

  it('should create a new project', () => {
    cy.get('[data-testid="new-project-button"]').click();
    cy.get('[data-testid="project-name-input"]').type('Test Project');
    cy.get('[data-testid="project-path-input"]').type('/test/path');
    cy.get('[data-testid="create-project-button"]').click();
    
    cy.get('[data-testid="project-list"]').should('contain', 'Test Project');
  });

  it('should delete a project', () => {
    // First create a project
    cy.createProject('Test Delete Project', '/test/delete');
    
    // Then delete it
    cy.deleteProject('Test Delete Project');
  });

  it('should start a new chat session', () => {
    cy.createProject('Chat Test Project', '/test/chat');
    cy.startChatSession('Chat Test Project');
    
    cy.get('[data-testid="chat-interface"]').should('be.visible');
    cy.get('[data-testid="chat-input"]').should('be.visible');
  });

  it('should send a chat message', () => {
    cy.createProject('Message Test Project', '/test/message');
    cy.startChatSession('Message Test Project');
    cy.sendChatMessage('Hello, Claude!');
    
    cy.get('[data-testid="chat-messages"]').should('contain', 'Hello, Claude!');
  });

  it('should navigate between different sections', () => {
    cy.get('[data-testid="nav-chat"]').click();
    cy.url().should('include', '/chat');
    
    cy.get('[data-testid="nav-files"]').click();
    cy.url().should('include', '/files');
    
    cy.get('[data-testid="nav-git"]').click();
    cy.url().should('include', '/git');
    
    cy.get('[data-testid="nav-tasks"]').click();
    cy.url().should('include', '/tasks');
  });

  it('should be responsive on mobile', () => {
    cy.viewport(375, 667); // iPhone SE size
    
    cy.get('[data-testid="mobile-menu-button"]').should('be.visible');
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-menu"]').should('be.visible');
  });
});
