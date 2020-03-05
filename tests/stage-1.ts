// Third-party modules.
import { describe, it } from 'mocha';
import { expect } from 'chai';

// Artifacts.
import { decorateClass, decorateProperty, decorateMethod } from './artifacts/stage-1';

// Sources.
import { fromClassDecorator, fromPropertyDecorator, fromMethodDecorator } from '..';

describe('Bridge for legacy class decorator', () => {
    it('should be able to hoist legacy class decorator to stage 2', () => {
        const decorate = fromClassDecorator(decorateClass);

        @decorate
        class Target {}

        const instance = new Target();

        expect(instance).to.have.property('decorated', true);
    });

    it('should not be able to use legacy class decorator without the bridge', () => {
        expect(() => {
            @decorateClass
            class Target {}
        }).to.throw(TypeError);
    });
});

describe('Bridge for legacy property decorator', () => {
    it('should be able to hoist legacy property decorator to stage 2', () => {
        const decorate = fromPropertyDecorator(decorateProperty);

        class Target {
            @decorate
            property = true;
        }

        const instance = new Target();

        expect(instance).to.have.property('decorated', true);
        expect(instance).to.have.property('property', false);
    });

    it('should not be able to use legacy property decorator without the bridge', () => {
        expect(() => {
            class Target {
                @decorateProperty
                property = true;
            }
        }).to.throw(TypeError);
    });
});

describe('Bridge for legacy method decorator', () => {
    it('should be able to hoist legacy method decorator to stage 2', () => {
        const decorate = fromMethodDecorator(decorateMethod);

        class Target {
            @decorate
            method() {
                return true;
            }
        }

        const instance = new Target();

        expect(instance).to.have.property('decorated', true);
        expect(instance.method(), 'The method does not decorated').to.be.false; // eslint-disable-line no-unused-expressions
    });

    it('should not be able to use legacy method decorator without the bridge', () => {
        expect(() => {
            class Target {
                @decorateMethod
                method() {}
            }
        }).to.throw(TypeError);
    });
});
