export interface Query {
  input: string;
  cursor: number;
  count: number;
  done: boolean;
}