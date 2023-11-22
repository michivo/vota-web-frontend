import type { UserRole } from "../userState";

export interface UserDto {
    id: number,
    role: UserRole,
    username: string,
    email: string | undefined | null,
    fullName: string,
    regions: RegionDto[],
};

export interface CreateUserRequest extends UserWithPasswordDto {
    sendPasswordLink: boolean,
}

export interface UserWithPasswordDto extends UserDto {
    password: string,
}

export interface RegionDto {
    id: number,
    regionName: string,
}
