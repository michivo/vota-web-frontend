import type { SignInRequest, SignInResponse } from "../types/api/signIn";
import { getBaseUrl } from "./settingsProvider";

export class UserApi {

    public async signIn(request: SignInRequest): Promise<SignInResponse> {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/v1/user/signInRequests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        const responseData = await response.json();
        return responseData as SignInResponse;
    }

}
