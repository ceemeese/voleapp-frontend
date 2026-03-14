type ErrorConstructor = new (message? : string) => Error

const createErrorFactory = (name: string) : ErrorConstructor => {
    return class extends Error {
        constructor (message? : string) {
            super(message)
            this.name = name;
        }
    }
}


export const ConnectionError = createErrorFactory('ConnectionError');
export const NotAuthorizedError = createErrorFactory('NotAuthorizedError')
export const Forbidden = createErrorFactory('Forbidden');
export const NotFoundError = createErrorFactory('NotFoundError');
export const ValidationError = createErrorFactory('ValidationError');
export const BusinessError = createErrorFactory('BusinessError');


