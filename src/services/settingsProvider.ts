import { PUBLIC_API_URL } from '$env/static/public';

function getBaseUrl(): string {
    return PUBLIC_API_URL;
}

export { getBaseUrl };
