import * as Stage2 from './stage-2';

export function fromClassDecorator(decorator: ClassDecorator) {
    return Stage2.asClassDecorator(descriptor => ({
        ...descriptor,

        finisher: target => decorator(target)
    }));
}

export function fromPropertyDecorator(decorator: PropertyDecorator) {
    return Stage2.asFieldDecorator(descriptor => {
        const keyForFinisher = Symbol(`decoratorsBridge@<${String(descriptor.key)}>`);
        const keyForExtra = Symbol(`decoratorsBridge@<${String(descriptor.key)}>`);
        const isStaticField = descriptor.placement === 'static';

        let result: Omit<PropertyDescriptor, 'get' | 'set' | 'value'> & { initializer: (() => any) };

        const extras: Stage2.FieldDescriptor['extras'] = [ {
            kind: 'field' as const,
            key: keyForExtra,
            placement: descriptor.placement,
            descriptor: { configurable: true },

            initializer(this: object) {
                const { key: propertyKey } = descriptor;

                if (result) {
                    const { initializer, ...descriptor } = result;

                    Reflect.defineProperty(this, propertyKey, {
                        ...descriptor,

                        value: initializer()
                    });
                } else {
                    Reflect.defineProperty(this, propertyKey, {
                        ...descriptor.descriptor,

                        value: descriptor.initializer ? descriptor.initializer() : undefined
                    });
                }
                if (Reflect.has(this, keyForFinisher)) {
                    Reflect.deleteProperty(this, keyForFinisher);
                }
            }
        } ];

        return {
            ...descriptor,

            key: keyForFinisher,
            descriptor: { configurable: true },
            initializer: () => undefined,

            finisher: (target: new (...args: any) => any) => {
                result = Reflect.apply(decorator, undefined, [
                    isStaticField ? target : target.prototype,
                    descriptor.key,
                    { ...descriptor.descriptor, initializer: descriptor.initializer }
                ]);

                if (isStaticField && Reflect.has(target, keyForFinisher)) {
                    Reflect.deleteProperty(target, keyForFinisher);
                }
            },

            extras
        };
    });
}

export function fromMethodDecorator(decorator: MethodDecorator) {
    return Stage2.asMethodDecorator(descriptor => {
        const isStaticMethod = descriptor.placement === 'static';
        const { key: propertyKey } = descriptor;

        return {
            ...descriptor,

            finisher: (target: new (...args: any) => any) => {
                const injectableTarget = isStaticMethod ? target : target.prototype;

                const result = Reflect.apply(decorator, undefined, [
                    injectableTarget,
                    propertyKey,
                    descriptor.descriptor
                ]);

                if (result) {
                    Reflect.defineProperty(injectableTarget, propertyKey, result);
                }
            }
        };
    });
}
