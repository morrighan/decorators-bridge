export function decorateClass(target: Function) {
    Reflect.defineProperty(target.prototype, 'decorated', { value: true });
}

export function decorateProperty(target: any, propertyKey: PropertyKey, ...args: any[]) {
    Reflect.defineProperty(target, 'decorated', { value: true });

    return { ...args[2], initializer: () => false };
}

export function decorateMethod(target: any, propertyKey: PropertyKey, descriptor: PropertyDescriptor) {
    Reflect.defineProperty(target, 'decorated', { value: true });

    function method() {
        return false;
    }

    return { ...descriptor, value: method } as PropertyDescriptor;
}
