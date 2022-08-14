export interface Connection {
  name?: string;
  id: string;
  host: string;
  port: string;
  password?: string;
  tls: boolean;
}
