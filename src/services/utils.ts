import { get } from "svelte/store";
import { userStore } from "../stores/userStore";

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

function handleResponse(response: Response) : Response {
    if(!response.ok) {
        throw new Error('Request failed');
    }
    return response;
}

export { parseJwt, getAuthHeader, handleResponse };
