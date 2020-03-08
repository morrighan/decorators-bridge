// Sources.
import { ClassDescriptor, FieldDescriptor, MethodDescriptor } from '../../..';

// Constants.
const decoratedDescriptor: FieldDescriptor = {
    kind: 'field',
    key: 'decorated',
    placement: 'own',
    descriptor: { configurable: true },
    initializer: () => true
};

export function decorateClass(descriptor: ClassDescriptor) {
    return {
        ...descriptor,

        elements: [ ...descriptor.elements, decoratedDescriptor ]
    } as ClassDescriptor;
}

export function decorateField(descriptor: FieldDescriptor) {
    return {
        ...descriptor,

        initializer: () => false,
        extras: [ decoratedDescriptor ]
    } as FieldDescriptor;
}

export function decorateMethod(descriptor: MethodDescriptor) {
    function method() {
        return false;
    }

    return {
        ...descriptor,

        descriptor: { ...descriptor.descriptor, value: method },
        extras: [ decoratedDescriptor ]
    } as MethodDescriptor;
}
