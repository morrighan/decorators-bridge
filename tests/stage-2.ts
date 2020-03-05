// Third-party modules.
import { describe, it } from 'mocha';
import { expect } from 'chai';

// Artifacts.
import { decorateClass, decorateField, decorateMethod } from './artifacts/stage-2';

// Sources.
import { asClassDecorator, asFieldDecorator, asMethodDecorator } from '..';

describe('Bridge for stage 2 decorators', () => {
    it('should be return given decorator function as-is', () => {
        expect(() => {
            const decorate = asClassDecorator(decorateClass);

            @decorate
            class Target {}

            const instance = new Target();

            expect(instance).to.have.property('decorated', true);
        }).to.not.throw();

        expect(() => {
            const decorate = asFieldDecorator(decorateField);

            class Target {
                @decorate
                property = true;
            }

            const instance = new Target();

            expect(instance).to.have.property('decorated', true);
            expect(instance).to.have.property('property', false);
        }).to.not.throw();

        expect(() => {
            const decorate = asMethodDecorator(decorateMethod);

            class Target {
                @decorate
                method() {
                    return true;
                }
            }

            const instance = new Target();

            expect(instance).to.have.property('decorated', true);
            expect(instance.method(), 'The method does not decorated').to.be.false; // eslint-disable-line no-unused-expressions
        }).to.not.throw();
    });
});
