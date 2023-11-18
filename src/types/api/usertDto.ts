import type { UserRole } from "../userState";

export interface UserDto {
    id: number,
    role: UserRole,
    username: string,
    email: string | undefined | null,
    fullName: string,
};

export interface UserWithPasswordDto extends UserDto {
    password: string,
}