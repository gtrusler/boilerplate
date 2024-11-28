describe('Full User Journey', () => {
  it('should complete entire user flow', () => {
    // Sign up
    cy.visit('/auth/signup')
    cy.fillSignUpForm()
    
    // Verify email
    cy.verifyEmail()
    
    // Subscribe to plan
    cy.visit('/pricing')
    cy.selectPlan('Basic')
    cy.fillStripeForm()
    
    // Upload file
    cy.visit('/dashboard')
    cy.uploadFile('test.jpg')
    
    // Use AI feature
    cy.generateAIResponse('Test prompt')
    
    // Check analytics
    cy.visit('/analytics')
    cy.checkEventTracking()
  })
}) 