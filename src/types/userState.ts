import type { User } from "firebase/auth";

export interface UserState {
    isLoggedIn: boolean,
    user: User | null | undefined,
    initialized: boolean,
}
