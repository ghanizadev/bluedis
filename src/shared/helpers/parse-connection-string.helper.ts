import { Connection } from "../../redux/Types/Connection";

export const parseConnectionString = (c: Connection) => {
  return `redis${c.tls ? "s" : ""}://${c.password ? `:${c.password}@` : ""}${
    c.host
  }:${c.port ?? 80}`;
};
