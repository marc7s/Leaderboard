import { Driver } from "@shared/api";

export enum UserPipeType {
    Username,
    FullName
}

export function getUsernameFromDriver(driver: Driver): string {
    return `${driver.firstName[0]}. ${driver.lastName}`;
}