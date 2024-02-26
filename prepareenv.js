import { writeFileSync } from 'fs';

const apiUrl = process.env.PUBLIC_API_URL;

if(apiUrl) {
    console.error(`Overriding .env, setting PUBLIC_API_URL: ${apiUrl}`);
    writeFileSync('/app/.env', `PUBLIC_API_URL='${apiUrl}'`, { flag: 'w'});
}