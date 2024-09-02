import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '../.env' });

export function createURL(
  baseURL: string,
  params: { [key: string]: string } = {}
): string {
  let searchParams: string[] = [];
  for (let param in params)
    searchParams.push(
      `${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`
    );

  if (searchParams.length > 0) return `${baseURL}?${searchParams.join('&')}`;
  return baseURL;
}
