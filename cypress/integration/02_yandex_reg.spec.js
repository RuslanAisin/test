/// <reference types="cypress" />

describe('Yandex registration', () => {
    it('Mission failed :(', () => {
        const value1 = () => Cypress._.random(0, 1e7);
        const value2 = () => Cypress._.random(0, 1e6);
        let firstname;
        let lastname;
        const random1 = value1();
        firstname = `firstName${random1}`;
        const random2 = value2();
        lastname = `lastName${random2}`;
        const phone = `911${random1}`;

        cy.visit('https://passport.yandex.ru/registration');
        cy.title().should('eq', 'Регистрация');
        cy.get('#firstname').type(firstname);
        cy.get('#lastname').type(lastname, {force: true});
        cy.get('#login').type(firstname, {force: true});
        cy.get('#password').type(lastname, {force: true});
        cy.get('#password_confirm').type(lastname, {force: true});
        cy.get('#keep_unsubscribed').check();
        cy.get('#phone').type(phone, {force:true});
        cy.get('button[type="submit"]').click();
        cy.get('#phoneCode').type(phone, {force:true});
        cy.get('.form__popup-error').contains('Неправильный код, попробуйте ещё раз');
    })
});