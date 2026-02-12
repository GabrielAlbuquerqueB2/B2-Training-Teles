const user = Cypress.env('CYPRESS_USER')
const password = Cypress.env('CYPRESS_PASS')

beforeEach(() => {
  cy.visit('http://localhost:3000')
})

describe('Login', () => {
  it('Login bem sucedido', () => {    
    cy.makeLogin()    
    cy.contains('Página inicial')
  })

  it('Login mal sucedido', () => {    
    cy.get('input[name=user]').type('joao')
    cy.get('input[name=password]').type('123456')
    cy.get('#login').click()
    cy.contains('Login failed')
  })

  it('Realiza logout', () => {    
    cy.makeLogin()
    cy.contains('Página inicial')
    cy.get('#logout').click()    
    cy.get('input[name=user]')
  })

})