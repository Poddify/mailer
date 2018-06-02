import Chance from 'chance';
import { expect } from 'chai';
import injectParameters from '../../../src/util/inject-parameters';

const chance = new Chance();

describe('Feature: Email template parameter injector', () => {
    it('Scenario: injects email template paramters', () => {
        const paramKeys = chance.n(chance.word, chance.d6());
        const params = paramKeys.reduce((memo, key) => ({
            ...memo,
            [key]: chance.string()
        }), {});

        let template = chance.string();
        let expectedHtml = template;

        paramKeys.forEach((key) => {
            const pad = chance.string();

            template = `${template}{{${key}}}${pad}`;
            expectedHtml = `${expectedHtml}${params[key]}${pad}`;
        });

        const html = injectParameters(template, params);

        expect(html, 'should inject html parameters').to.equal(expectedHtml);
    });
});
