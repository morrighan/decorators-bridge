type ExtraDescriptors = (Omit<FieldDescriptor, 'extras' | 'finisher'> | Omit<MethodDescriptor, 'extras' | 'finisher'>)[];

interface Finishable {
    finisher?: <T extends new (...args: any) => any>(v: T) => void | T;
}

interface Extendible extends Finishable {
    extras?: ExtraDescriptors;
}

export interface ClassDescriptor extends Finishable {
    kind: 'class';
    elements: ExtraDescriptors;
}

export interface FieldDescriptor extends Extendible {
    kind: 'field';
    key: PropertyKey;
    placement: 'static' | 'own';
    descriptor: Omit<PropertyDescriptor, 'get' | 'set' | 'value'>
    initializer: (() => any) | undefined;
}

export interface MethodDescriptor extends Extendible {
    kind: 'method';
    key: PropertyKey;
    placement: 'static' | 'prototype';
    descriptor: Omit<PropertyDescriptor, 'get' | 'set'> | Omit<PropertyDescriptor, 'value' | 'writable'>;
}

export function asClassDecorator(decorator: (descriptor: ClassDescriptor) => void | ClassDescriptor) {
    return decorator as unknown as ClassDecorator;
}

export function asFieldDecorator(decorator: (descriptor: FieldDescriptor) => void | FieldDescriptor) {
    return decorator as unknown as PropertyDecorator;
}

export function asMethodDecorator(decorator: (descriptor: MethodDescriptor) => void | MethodDescriptor) {
    return decorator as unknown as MethodDecorator;
}
