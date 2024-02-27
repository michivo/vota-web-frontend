import { browser } from "$app/environment";
import { userStore } from "../stores/userStore";
import { UserApi } from "./userApi";
import { parseJwt } from "./utils";

export class UserService {
    private api: UserApi;

    constructor() {
        this.api = new UserApi();
    }

    public async signIn(username: string, password: string) {
        const response = await this.api.signIn({ username, password });

        if (response && response.token) {
            if (browser) {
                localStorage.setItem('user', response.token);
                const tokenData = parseJwt(response.token);
                const userState = {
                    isLoggedIn: true,
                    user: {
                        displayName: tokenData.name,
                        name: tokenData.sub,
                        email: tokenData.email,
                        id: tokenData.uid,
                        role: tokenData.role,
                        token: response.token,
                        regionIds: tokenData.regionIds,
                    },
                };
                userStore.set(userState);
            }
        }
    }

    public async resetPassword(username: string) {
        await this.api.resetPassword(username);
    }    

    public signOut() {
        localStorage.removeItem('user');
        userStore.set({
            isLoggedIn: false,
            user: null,
        });
    }
}
