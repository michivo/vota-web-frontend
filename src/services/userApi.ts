import type { SignInRequest, SignInResponse } from "../types/api/signIn";
import type { UserDto, UserWithPasswordDto } from "../types/api/usertDto";
import { getBaseUrl } from "./settingsProvider";
import { getAuthHeader } from "./utils";

export class UserApi {
    public async signIn(request: SignInRequest): Promise<SignInResponse> {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/v1/users/signInRequests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        const responseData = await response.json();
        return responseData as SignInResponse;
    }

    public async getAllUsers(): Promise<UserDto[]> {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}/v1/users/`, {
            method: 'GET',
            headers: getAuthHeader(),
        });

        const responseData = await response.json();
        return responseData as UserDto[];
    }

    public async deleteUser(user: UserDto): Promise<void> {
        const baseUrl = getBaseUrl();
        await fetch(`${baseUrl}/v1/users/${user.id}`, {
            method: 'DELETE',
            headers: getAuthHeader(),
        });
    }

    public async setPassword(id: number, password: string): Promise<void> {
        const baseUrl = getBaseUrl();
        await fetch(`${baseUrl}/v1/users/${id}/password`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ password }),
        });
    }

    public async updateUser(user: UserDto): Promise<void> {
        const baseUrl = getBaseUrl();
        await fetch(`${baseUrl}/v1/users/${user.id}`, {
            method: 'PUT',
            headers: getAuthHeader(),
            body: JSON.stringify(user),
        });
    }

    public async createUser(newUser: UserWithPasswordDto): Promise<void> {
        const baseUrl = getBaseUrl();
        await fetch(`${baseUrl}/v1/users`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify(newUser),
        });
    }
}
