import type { Handle } from "@sveltejs/kit";

const securityHeaders = {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': 'default-src \'self\'; style-src \'self\' \'unsafe-inline\'; script-src \'self\' \'unsafe-inline\'; connect-src \'self\' https://vota-api.faschinger.com/ https://vota-api.gruene.at/',
};

export const handle: Handle = async ({ event, resolve }) => {
    const response = await resolve(event);
    Object.entries(securityHeaders).forEach(
        ([header, value]) => response.headers.set(header, value),
    );

    return response;
};
