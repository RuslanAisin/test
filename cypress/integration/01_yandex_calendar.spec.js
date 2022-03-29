/// <reference types="cypress" />

const date = Cypress.dayjs().add(1, 'day').format('DD.MM.YYYY').toString();
const toggleForm = '.AuthLoginInputToggle-wrapper';
const username = '.user-account_has-ticker_yes .user-account__name';

describe('Yandex Calendar test', () => {
  it('Login', () => {
    cy.visit('https://calendar.yandex.ru');
    cy.title().should('eq', 'Авторизация');
    cy.get('body').then(body => {
      if (body.find(toggleForm).length > 0) {
        cy.log('Вторая форма логина');
        cy.get('#passp-field-login').then(form => {
          if (form.find('[placeholder="Логин или email"]').length > 0) {
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
      cy.get('#passp-field-login').type(credentials.login);
      cy.get('[id="passp:sign-in"]').click();
      cy.get('#passp-field-passwd').type(credentials.password, {force:true});
      cy.get('[id="passp:sign-in"]').click();
      cy.url().should('eq', 'https://calendar.yandex.ru/week?uid=1593314146');
      cy.get(username).should('contain.text', credentials.login);
      cy.title().should('eq', 'Яндекс.Календарь');
      cy.get('[class$="AsideCreateEvent"]').click();
      cy.get('.qa-NameField input').type('Новая встреча!');
      cy.contains('Описание').click().then(() => {
        cy.get('.textarea__control').type(`Тестовое описание события \n\ Автотестовая встреча, напрвленная на углубление процесса интеграции!`)
      });
      cy.get('.qa-DatesField_Start-DatePicker-Input').clear().type(`${date}{esc}`);
      cy.get('.qa-MembersField input').then((emails) => {
        cy.get(emails).type(`${credentials.emailFirst}{enter}`);
        cy.get(emails).type(`${credentials.emailSecond}{enter}`);
        cy.get(emails).type(`${credentials.emailThird}{enter}`);
      });
      cy.get('.qa-LocationField input').type('Санкт-Петербург{enter}');
      cy.get('.qa-AvailabilityField button').type('{enter}{downArrow}{downArrow}{enter}');
      cy.get('button[type="submit"]').click();
    });
  });
});