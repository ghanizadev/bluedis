/* eslint-disable  @typescript-eslint/no-explicit-any */

export interface LangType {
  [key: string]: ((...args: any[]) => string) | string;
}