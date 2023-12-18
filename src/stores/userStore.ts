import { writable } from "svelte/store";
import type { UserState } from "../types/userState";
import { browser } from "$app/environment";
import { parseJwt } from "../services/utils";

export const userStore = writable<UserState>(getInitialState());

function getInitialState(): UserState {
    if (browser) {
        const storedToken = localStorage.getItem('user');
        if (storedToken) {
            const parsedJwt = parseJwt(storedToken);
            const expiresSeconds = parsedJwt.exp;
            const expirationDate = new Date(0);
            expirationDate.setUTCSeconds(expiresSeconds);
            const now = new Date();
            if (now < expirationDate) {
                return {
                    isLoggedIn: true,
                    user: {
                        displayName: parsedJwt.name,
                        name: parsedJwt.sub,
                        email: parsedJwt.email,
                        id: parsedJwt.uid,
                        role: parsedJwt.role,
                        token: storedToken,
                        regionIds: [],
                    },
                };
            }

            localStorage.removeItem('user');
        }
    }

    return {
        isLoggedIn: false,
        user: null,
    };
}
