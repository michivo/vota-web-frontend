import { get } from "svelte/store";
import { userStore } from "../stores/userStore";
import { ApiError } from "../types/api/apiError";

function parseJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function getAuthHeader(): Record<string, string> {
    const user = get(userStore);
    const headers = {} as Record<string, string>;
    headers['Content-Type'] = 'application/json';
    if(user.user) {
        headers['Authorization'] = `Bearer ${user.user.token}`;
    }
    return headers;
}

async function handleResponse(response: Response) : Promise<Response> {
    if(!response.ok) {
        try {
            const error = await response.json();
            if(error.message) {
                const errorMessage = JSON.parse(error.message);
                const errorList = errorMessage.errors.map((e: { msg: string, path: string }) => `${e.path ? e.path + ': ' + e.msg : e.msg}`);
                throw new ApiError(errorList.join(', '));
            }
            else {
                throw new Error(error);
            }
        }
        catch(err) {
            if(err instanceof ApiError) {
                throw err;
            }
            throw new Error('Unerwarteter Fehler');
        }
    }
    return response;
}

export { parseJwt, getAuthHeader, handleResponse };
