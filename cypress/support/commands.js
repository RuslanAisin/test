// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Функция авторизации
export const AUTH = (loginname) => {
    const toggleForm = '.AuthLoginInputToggle-wrapper';
    const username = '.user-account_has-ticker_yes .user-account__name';

    cy.log(`Авторизация под юзером ${loginname}`);
    cy.visit('/');
    cy.title().should('eq', 'Авторизация');
    cy.get('body').then(body => {
      if (body.find(toggleForm).length > 0) {
        cy.log('Вторая форма логина');
        cy.get('#passp-field-login').then(form => {
          if (form.find('[placeholder="Логин или email"]')) {
            cy.log('Вторая логина -> Вводим почту');
          }
          else {
            cy.log('Вторая форма логина -> Переключаемся на почту');
            cy.contains('Почта').click();
          }
        })
      }
      else {
        cy.log('Первая форма логина');
      }
    });
    cy.readFile('./secret.json').then((credentials) => {
      cy.get('#passp-field-login').type(credentials[loginname].login);
      cy.get('[id="passp:sign-in"]').click();
      cy.get('#passp-field-passwd').type(credentials[loginname].password, {force:true});
      cy.get('[id="passp:sign-in"]').click();
      cy.url().should('eq', `https://calendar.yandex.ru/week?uid=${credentials[loginname].userid}`);
      cy.get(username).should('contain.text', credentials[loginname].login);
      cy.title().should('eq', 'Яндекс.Календарь');
    })
};