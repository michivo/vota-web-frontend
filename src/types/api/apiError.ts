export class ApiError extends Error {
    constructor(errorMessage: string) {
        super(errorMessage);
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

export async function buildApiError(response: Response, operation: string): Promise<ApiError> {
    try {
        const responseBody = await response.json();
        if(responseBody && responseBody.message) {
            return new ApiError(responseBody.message);
        }
        console.error(`Unknown error on operation ${operation}`);
        console.error(responseBody);
        return new ApiError(`Unbekannter Fehler ${operation}`);
    }
    catch(err: unknown) {
        console.error(`Unexpected error on operation ${operation}`);
        console.error(err);
        return new ApiError(`Unerwarteter Fehler ${operation}`);
    }
}