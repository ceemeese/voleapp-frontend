interface HandledError extends Error {
    handled?: boolean;
}

type ErrorConstructor = new (message? : string) => Error

const createErrorFactory = (name: string) : ErrorConstructor => {
    return class extends Error {
        constructor (message? : string) {
            super(message)
            this.name = name;
        }
    }
}

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    return 'Error inesperado';
};

export const isHandledError = (error: unknown): boolean => {
    if (!(error instanceof Error)) return false;
    return (error as HandledError).handled === true;
};

export const ConnectionError = createErrorFactory('ConnectionError');
export const NotAuthorizedError = createErrorFactory('NotAuthorizedError')
export const Forbidden = createErrorFactory('Forbidden');
export const NotFoundError = createErrorFactory('NotFoundError');
export const ValidationError = createErrorFactory('ValidationError');
export const BusinessError = createErrorFactory('BusinessError');


