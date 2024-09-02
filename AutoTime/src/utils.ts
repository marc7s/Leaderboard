// Parses an object to an interface
export function parseWithMapping(object: any, template: any): any {
  let parsed: any = {};

  for (const [key, value] of Object.entries(template)) {
    if (Object.keys(object).includes(key))
      parsed[value as string] = object[key];
  }

  return parsed;
}

// Parses an enum from its values
export function parseEnum<T, U extends object>(value: any, enumTemplate: U) {
  return value in enumTemplate ? (value as T) : (0 as any as T);
}

// Returns the maximum difference between two elements in an array
export function maxDifference(arr: number[]) {
  let maxDiff = -1;
  let min = arr[0];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > min && maxDiff < arr[i] - min) maxDiff = arr[i] - min;

    if (arr[i] < min) min = arr[i];
  }

  return maxDiff;
}

// A function that takes a lap time in milliseconds and returns a formatted string
export function formatLapTime(lapTimeInMS: number): string {
  const date: Date = new Date(lapTimeInMS);
  return `${pad((date.getHours() - 1).toString(), '0', 2)}:${pad(
    date.getMinutes().toString(),
    '0',
    2
  )}:${pad(date.getSeconds().toString(), '0', 2)}.${pad(
    date.getMilliseconds().toString(),
    '0',
    3
  )}`;
}

// Helper function that pads a string with a character to a certain length
export function pad(str: string, padChar: string, length: number): string {
  const char = padChar[0];
  const preStr: string = char.repeat(length - str.length);

  return preStr + str;
}
