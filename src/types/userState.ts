export interface User {
    name: string,
    role: UserRole,
    id: number,
    displayName: string,
    email: string,
    token: string,
    regionIds: number[],
}

export interface UserState {
    isLoggedIn: boolean,
    user: User | null | undefined,
}

export enum UserRole {
    None = 0,
    Admin = 1,
    Standard = 2,
}
