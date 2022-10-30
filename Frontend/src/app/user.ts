import { Driver } from "@shared/api";

export enum UserPipeType {
    Username,
    FullName
}

export function getUserNameFromDriver(driver: Driver): string {
    return `${driver.firstName[0]}. ${driver.lastName}`;
}