/// <reference types="cypress" />

import { AUTH } from "../support/commands";

const date = Cypress.dayjs().add(1, 'day').format('DD.MM.YYYY').toString();

describe('Yandex Calendar test', () => {
  it('Create meeting', () => {
    AUTH('user1');
      cy.get('[class$="AsideCreateEvent"]').click();
      cy.get('.qa-NameField input').type('Новая встреча!');
      cy.contains('Описание').click().then(() => {
        cy.get('.textarea__control').type(`Тестовое описание события \n\ Автотестовая встреча, напрвленная на углубление процесса интеграции!`)
      });
      cy.get('.qa-DatesField_Start-DatePicker-Input').clear().type(`${date}{esc}`);
      cy.get('.qa-MembersField input').then((emails) => {
        cy.readFile('./secret.json').then((credentials) => {
          cy.get(emails).type(`${credentials.emailFirst}{enter}`);
          cy.get(emails).type(`${credentials.emailSecond}{enter}`);
          cy.get(emails).type(`${credentials.emailThird}{enter}`);
        });
      });
      cy.get('.qa-LocationField input').type('Санкт-Петербург{enter}');
      cy.get('.qa-AvailabilityField button').type('{enter}{downArrow}{downArrow}{enter}');
      cy.get('button[type="submit"]');
      cy.contains('Новая встреча!');
      cy.log('Встреча создана!');
      cy.contains('Новая встреча!').wait(2000).click();
      cy.get('[class*="popup2_visible_yes"]').should('be.visible');
      cy.get('[title="Удалить"]').click();
      cy.get('.button2_theme_action').click();
      cy.log('Встреча удалена!');
    });
  });