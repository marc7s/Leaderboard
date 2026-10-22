export interface Token {
  jwt: string;
  expires: number;
}

export interface Login {
  username: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
}

export interface Game {
  id: number;
  name: string;
}

export interface Car {
  id: number;
  fullName: string;
  shortName: string;
}

export interface Weather {
  id: number;
  name: string;
}

export interface Tyre {
  id: number;
  fullName: string;
  shortName: string;
}

export interface Country {
  id: number;
  fullName: string;
  shortName: string;
  alpha2Code: string;
}

export interface Track {
  id: number;
  fullName: string;
  shortName: string;
  country: Country;
}

export interface Setup {
  id: number;
  description: string;
  custom: boolean;
  manual: boolean;
}

export interface Config {
  id: number;
  description: string;
  game: Game;
  track: Track;
  car: Car;
  weather: Weather;
  tyre: Tyre;
  setup: Setup;
}

export interface Time {
  id: number;
  time: string;
  millis: number;
  username: string;
  config: Config;
  valid: boolean;
}

export interface Class {
  id: number;
  name: string;
}

export interface Driver {
  firstName: string;
  lastName: string;
  shortName: string;
  number: number;
  country: Country;
}
