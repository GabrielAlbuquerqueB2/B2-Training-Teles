const user = Cypress.env('CYPRESS_USER')
const password = Cypress.env('CYPRESS_PASS')

beforeEach(() => {

})

describe('Harvest Ticket', () => {

    it('Create new harvest ticket', () => {
        cy.visit('http://localhost:3000')
        cy.makeLogin()
        cy.contains('Página inicial')
        cy.visit('http://localhost:3000/agricultural/harvest-ticket/new')
        cy.get('#U_B2AG_Date').type('2022-11-28')
        cy.get('#U_B2AG_Time').type('22:30')
        cy.get('input[name=U_B2AG_Crop').parent().click()
        cy.get('li[role="option"]').contains("2022/2023").click()
        cy.get('#U_B2AG_CCG').type('5656')
        cy.get('#U_B2AG_TicketNumber').type('25890')
        cy.get('input[name=U_B2AG_ProductionUnitCode').parent().click()
        cy.get('li[role="option"]').contains("UNIDADE 1").click()
        cy.get('input[name=U_B2AG_BPLId').parent().click()
        cy.get('li[role="option"]').contains("FAZENDA BASE 2").click()
        cy.get('input[name=U_B2AG_AgriOperation').parent().click()
        cy.get('li[role="option"]').contains("PLANTIO").click()
        cy.get('input[name=U_B2AG_Cultivation').parent().click()
        cy.get('li[role="option"]').contains("SOJA").click()
        cy.get('#U_B2AG_Driver').type('JOHN SNOW')
        cy.get('#U_B2AG_DriverDocument').type('123.456.789-0')
        cy.get('#U_B2AG_LicensePlate').type('ABC1234')
        cy.get('input[name=U_B2AG_PlateFederalUnit').parent().click()
        cy.get('li[role="option"]').contains("Mato Grosso").click()
        cy.get('#U_B2AG_Comments').type('TESTE AUTOMATIZADO DE ROMANEIO')
        
        
    })

})

